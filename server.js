import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig, Payment } from 'mercadopago';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Verifica se o token existe. Senão, avisa para o dono adicionar no arquivo .env
const mpAccessToken = process.env.MP_ACCESS_TOKEN;

if (!mpAccessToken || mpAccessToken === 'COLE_SEU_ACCESS_TOKEN_AQUI') {
  console.warn('⚠️ AVISO: MP_ACCESS_TOKEN não está configurado no arquivo .env!');
} else {
  console.log('✅ Mercado Pago Access Token detectado.');
}

// Inicializa a configuração do MP
const client = new MercadoPagoConfig({ accessToken: mpAccessToken || 'TEST-TOKEN-MOCK' });
const payment = new Payment(client);

app.post('/api/checkout', async (req, res) => {
  try {
    const { total, items, clientEmail, orderNumber, payerInfo } = req.body;

    const FORCE_MOCK = false; // DESATIVADO: Agora usando as credenciais reais de produção

    // Se as credenciais ainda não foram reais, podemos retornar mocado para não bugar o visual local
    if (FORCE_MOCK || !mpAccessToken || mpAccessToken === 'COLE_SEU_ACCESS_TOKEN_AQUI') {
       console.log('Criando PIX mockado (Sem Token)');
       return res.status(200).json({
          mock: true,
          status: 'SUCCESS_MOCK',
          ticket_url: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=fake_pix', // Pode ser qualquer coisa falsa visual
          qr_code_base64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', // imagem pixel branco em base64 fake
          qr_code: '00020101021126360014br.gov.bcb.pix0114+5511999999999520400005303986540510.005802BR5911Loja Pix6009Sao Paulo62070503***6304'
       });
    }

    // Fluxo Real PIX
    const body = {
      transaction_amount: Number(total),
      description: `Pedido ${orderNumber} - Games Nostálgicos`,
      payment_method_id: 'pix',
      payer: {
        email: clientEmail,
        first_name: payerInfo?.name?.split(' ')[0] || 'Cliente',
        last_name: payerInfo?.name?.split(' ').slice(1).join(' ') || 'GN',
        identification: {
          type: 'CPF',
          number: payerInfo?.cpf && payerInfo.cpf.length === 11 ? payerInfo.cpf : '19119119100' // Fail-safe to avoid full crash if bug
        }
      }
    };

    const requestOptions = { idempotencyKey: orderNumber };
    
    console.log('Gerando chave PIX Mercado Pago...');
    const result = await payment.create({ body, requestOptions });
    
    // O MP retorna result.point_of_interaction.transaction_data p/ PIX
    const transactionData = result.point_of_interaction?.transaction_data;

    res.status(200).json({
      status: result.status,
      ticket_url: transactionData?.ticket_url,
      qr_code_base64: transactionData?.qr_code_base64,
      qr_code: transactionData?.qr_code,
      paymentId: result.id
    });

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
    res.status(400).json({ 
       error: 'Mercado Pago recusou o pagamento', 
       details: error.message || 'Erro desconhecido'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
