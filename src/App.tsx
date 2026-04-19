import React, { useState, useEffect } from 'react';
import { Search, Filter, User, ShoppingCart, Eye, EyeOff, Shield, LogOut, Package, Users, Gamepad2, CheckCircle2, XCircle, MessageCircle, Plus, Edit, Trash2, X, DownloadCloud, Send } from 'lucide-react';

// Games list convertida para State dentro do App.tsx

const initialConsoles = [
  {
    id: 1,
    name: "PLAYSTATION 1",
    slug: "PS1",
    status: "INATIVO",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "PLAYSTATION 2",
    slug: "PS2",
    status: "ATIVO",
    image: "https://images.unsplash.com/photo-1605901302621-3e44b36017b3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "PLAYSTATION 3",
    slug: "PS3",
    status: "INATIVO",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "PLAYSTATION 4",
    slug: "PS4",
    status: "INATIVO",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "DREAMCAST",
    slug: "dreamcast",
    status: "INATIVO",
    image: "https://images.unsplash.com/photo-1628178652309-8dcb4fe66d8b?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "PC",
    slug: "pc",
    status: "ATIVO",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=800&auto=format&fit=crop"
  }
];

const initialUsers = [
  { id: 1, name: 'Administrador', email: 'admin@gamesnostalgicos.com', role: 'ADMIN', status: 'ATIVO', registeredAt: '1 Janeiro 2026' },
  { id: 2, name: 'Patrick Veras', email: 'veraspatrick@gmail.com', role: 'CLIENTE', status: 'ATIVO', registeredAt: '12 Fevereiro 2026' },
  { id: 3, name: 'João Silva', email: 'joao.silva@teste.com', role: 'CLIENTE', status: 'INATIVO', registeredAt: '15 Março 2026' },
  { id: 4, name: 'Maria Souza', email: 'maria.souza@teste.com', role: 'CLIENTE', status: 'ATIVO', registeredAt: '22 Março 2026' },
];

const initialPedidos = [
  {
    id: 1,
    orderNumber: "2AE91366",
    clientEmail: "veraspatrick@gmail.com",
    date: "31/01/2026 às 20:14:00",
    total: 10.00,
    items: [
      { name: "MAD MAX OTIMIZADO PARA PC FRACO", qty: 1, price: 10.00 }
    ],
    status: "AGUARDANDO"
  },
  {
    id: 2,
    orderNumber: "8BF29011",
    clientEmail: "joao.silva@teste.com",
    date: "14/02/2026 às 15:30:00",
    total: 45.50,
    items: [
      { name: "GOD OF WAR 2 PS2", qty: 1, price: 25.50 },
      { name: "BULLY PS2", qty: 1, price: 20.00 }
    ],
    status: "PAGO"
  }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('TODOS');
  const [currentView, setCurrentView] = useState<'catalog' | 'login' | 'register' | 'admin' | 'game'>('catalog');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [loggedInEmail, setLoggedInEmail] = useState(() => localStorage.getItem('loggedInEmail') || '');
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [adminActiveTab, setAdminActiveTab] = useState<'pedidos' | 'usuarios' | 'jogos' | 'consoles'>('jogos');
  const [editingConsole, setEditingConsole] = useState<any>(null);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [adminGameSearch, setAdminGameSearch] = useState('');
  const [adminGameFilter, setAdminGameFilter] = useState('TODOS');
  
  const [accountNewPassword, setAccountNewPassword] = useState('');
  const [accountConfirmPassword, setAccountConfirmPassword] = useState('');
  const [showAccountNewPassword, setShowAccountNewPassword] = useState(false);
  const [showAccountConfirmPassword, setShowAccountConfirmPassword] = useState(false);

  const [checkoutData, setCheckoutData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  
  const [pixPayload, setPixPayload] = useState<any>(null);
  const [isProcessingPIX, setIsProcessingPIX] = useState(false);

  const [cartItems, setCartItems] = useState<any[]>(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const cartTotalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const [usersList, setUsersList] = useState<any[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [activeChatOrderId, setActiveChatOrderId] = useState<number | null>(null);

  const [pedidosList, setPedidosList] = useState<any[]>(() => {
    const saved = localStorage.getItem('gamesnostalgicos_pedidos');
    return saved ? JSON.parse(saved) : initialPedidos;
  });

  const renderChatModal = () => {
         if (!activeChatOrderId) return null;
         const activeOrder = pedidosList.find(p => p.id === activeChatOrderId);
         if (!activeOrder) return null;
         
         const isAdmin = currentView === 'admin';
         
         const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const text = (e.currentTarget.elements.namedItem('chatInput') as HTMLInputElement).value.trim();
            if(!text) return;
            
            const newMessage = {
               sender: isAdmin ? 'admin' : 'cliente',
               text,
               timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };
            
            setPedidosList((prev: any[]) => prev.map((p: any) => {
               if(p.id === activeChatOrderId) {
                  return { 
                     ...p, 
                     messages: [...(p.messages || []), newMessage],
                     hasUnreadCliente: isAdmin ? true : p.hasUnreadCliente,
                     hasUnreadAdmin: !isAdmin ? true : p.hasUnreadAdmin
                  };
               }
               return p;
            }));
            
            (e.currentTarget.elements.namedItem('chatInput') as HTMLInputElement).value = '';
         };

         return (
           <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
             <div className="bg-[#0a0a0a] border border-[#00e5ff] rounded shadow-[0_0_30px_rgba(0,229,255,0.3)] w-full max-w-md h-[500px] flex flex-col relative overflow-hidden">
               <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black/50">
                 <div>
                   <h3 className="text-white font-black uppercase tracking-wider text-sm flex items-center gap-2">
                     <MessageCircle size={16} className="text-[#00e5ff]" /> 
                     Chat - Pedido #{activeOrder.orderNumber}
                   </h3>
                   <p className="text-[10px] text-gray-500 font-mono mt-1">Cliente: {activeOrder.clientEmail}</p>
                 </div>
                 <button onClick={() => setActiveChatOrderId(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                   <X size={20} />
                 </button>
               </div>
               
               <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 font-sans text-sm bg-black/20">
                 {!(activeOrder.messages?.length) && (
                    <div className="text-center text-gray-600 font-mono text-xs mt-10">Nenhuma mensagem ainda. Envie a primeira mensagem!</div>
                 )}
                 {activeOrder.messages?.map((msg: any, i: number) => {
                    const isMe = (isAdmin && msg.sender === 'admin') || (!isAdmin && msg.sender === 'cliente');
                    return (
                      <div key={i} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                        <span className={`text-[9px] font-bold tracking-wider mb-1 ${isMe ? 'text-[#00e5ff]' : 'text-[#ff6b00]'}`}>
                          {msg.sender === 'admin' ? 'ADMINISTRADOR' : 'CLIENTE'}
                        </span>
                        <div className={`p-3 rounded-lg ${isMe ? 'bg-[#00e5ff]/10 text-white border border-[#00e5ff]/30 rounded-br-none' : 'bg-gray-800/50 text-gray-300 border border-gray-700 rounded-bl-none'}`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-gray-500 font-mono mt-1">{msg.timestamp}</span>
                      </div>
                    )
                 })}
               </div>
               
               <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800 bg-black/50 flex gap-2">
                 <input 
                   name="chatInput" 
                   autoComplete="off"
                   placeholder="Digite sua mensagem..." 
                   className="flex-grow bg-[#111] border border-gray-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00e5ff] transition-colors"
                 />
                 <button type="submit" className="bg-[#00e5ff] text-black w-10 shrink-0 rounded hover:bg-cyan-300 transition-colors flex items-center justify-center">
                   <Send size={18} />
                 </button>
               </form>
             </div>
           </div>
         );
  };

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    localStorage.setItem('gamesnostalgicos_pedidos', JSON.stringify(pedidosList));
  }, [pedidosList]);

  const [consolesList, setConsolesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('consoles');
    return saved ? JSON.parse(saved) : initialConsoles;
  });

  const [gamesList, setGamesList] = useState<any[]>(() => {
    const saved = localStorage.getItem('games');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAddingGame, setIsAddingGame] = useState(false);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [fetchUrl, setFetchUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  useEffect(() => {
    localStorage.setItem('consoles', JSON.stringify(consolesList));
  }, [consolesList]);

  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(gamesList));
  }, [gamesList]);

  const activeConsoles = consolesList.filter(c => c.status === 'ATIVO');
  const filters = ['TODOS', ...activeConsoles.map(c => c.name)];

  // Reset filter if the active filter's console was deactivated
  useEffect(() => {
    if (activeFilter !== 'TODOS' && !filters.includes(activeFilter)) {
      setActiveFilter('TODOS');
    }
  }, [consolesList]);

  const filteredGames = gamesList.filter(game => {
    if (game.status === 'INATIVO') return false;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'TODOS') return matchesSearch;
    const selectedConsole = activeConsoles.find(c => c.name === activeFilter);
    const matchesFilter = selectedConsole ? game.platform === selectedConsole.slug : false;
    return matchesSearch && matchesFilter;
  });

  const handleBuyClick = (gameObj: any) => {
    if (!gameObj || !gameObj.id) return;
    setCartItems(prev => {
      const existing = prev.find(item => item.id === gameObj.id);
      if (existing) {
        return prev.map(item => item.id === gameObj.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, {
        id: gameObj.id,
        title: gameObj.title,
        platform: consolesList.find(c => c.slug === gameObj.platform)?.name || gameObj.platform,
        price: Number(gameObj.price),
        image: gameObj.image,
        qty: 1
      }];
    });
    setCurrentView('cart');
  };

  const handleLogin = () => {
    const email = emailInput.trim().toLowerCase();
    if (email === 'admin@gamesnostalgicos.com' && passwordInput.trim() === 'administrador123') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setLoggedInEmail(email);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('loggedInEmail', email);
      setCurrentView('admin');
    } else if (email) {
      setIsLoggedIn(true);
      setIsAdmin(false);
      setLoggedInEmail(email);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('isAdmin', 'false');
      localStorage.setItem('loggedInEmail', email);
      setCurrentView('catalog');
    }
  };

  const handleChangePassword = () => {
    if (!accountNewPassword || !accountConfirmPassword) {
      alert("Preencha as senhas!");
      return;
    }
    if (accountNewPassword !== accountConfirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    
    // As it is a frontend mock without real backend, we just update local state logic
    alert("Senha alterada com sucesso!");
    setAccountNewPassword('');
    setAccountConfirmPassword('');
  };

  const handleFetchGameData = async () => {
    if (!fetchUrl) return;
    setIsFetchingUrl(true);
    try {
      let title = '';
      let image = '';
      let description = '';

      // Tenta usar o Microlink API (suporta sites React/SPA e extrai metadados perfeitamente)
      try {
        const mlResponse = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(fetchUrl)}`);
        if (mlResponse.ok) {
          const mlData = await mlResponse.json();
          if (mlData.status === 'success' && mlData.data) {
            title = mlData.data.title || '';
            description = mlData.data.description || '';
            image = mlData.data.image?.url || '';
          }
        }
      } catch (err) {
        console.log('Microlink failed, trying fallback...', err);
      }

      // Fallback para AllOrigins se o Microlink falhar ou não retornar nada
      if (!title && !description) {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(fetchUrl)}`);
        if (response.ok) {
          const data = await response.json();
          const htmlText = data.contents;
          
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlText, 'text/html');

          title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') 
                  || doc.querySelector('title')?.textContent 
                  || doc.querySelector('h1')?.textContent
                  || doc.querySelector('.font-black')?.textContent
                  || '';
          
          image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
                  || doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content')
                  || doc.querySelector('img')?.getAttribute('src')
                  || '';

          description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content')
                        || doc.querySelector('meta[name="description"]')?.getAttribute('content')
                        || doc.querySelector('p')?.textContent
                        || '';
        }
      }

      // Fallback agressivo final se ainda não tivermos título
      if (!title || title.includes('Vite') || title.includes('React') || title.length > 50) {
        // Se ainda falhar ou puxar um UUID estranho, tentamos buscar no path final da url
        const urlObj = new URL(fetchUrl);
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
           const lastSegment = pathSegments[pathSegments.length - 1];
           // se o lastSegment for um UUID (comum em SPAs de produtos) ignoramos
           if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/i.test(lastSegment)) {
              title = lastSegment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
           } else if (pathSegments.length > 1) {
              const prevSegment = pathSegments[pathSegments.length - 2];
              title = prevSegment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
           }
        }
      }

      // Converte URLs relativas de imagem em absolutas
      if (image && !image.startsWith('http')) {
        const urlObj = new URL(fetchUrl);
        image = `${urlObj.protocol}//${urlObj.host}${image.startsWith('/') ? '' : '/'}${image}`;
      }

      const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
      if (titleInput && title) {
        titleInput.value = title;
      }

      const imageInput = document.querySelector('input[name="image"]') as HTMLInputElement;
      if (imageInput && image) {
        imageInput.value = image;
      }

      const descInput = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
      if (descInput && description) {
        descInput.value = description;
      }

      const textToSearch = `${title} ${fetchUrl}`.toLowerCase();
      const selectConsole = document.querySelector('select[name="console"]') as HTMLSelectElement;
      if (selectConsole) {
        for (const c of consolesList) {
           if (textToSearch.includes(c.name.toLowerCase()) || textToSearch.includes(c.slug.toLowerCase())) {
             selectConsole.value = c.slug;
             break;
           }
        }
      }

      if (fetchUrl.includes('youtube.com') || fetchUrl.includes('youtu.be')) {
        const videoInput = document.querySelector('input[name="video"]') as HTMLInputElement;
        if (videoInput) videoInput.value = fetchUrl;
      }

    } catch (err) {
      console.error(err);
      alert('Não foi possível buscar as informações dessa URL. O site pode estar bloqueando a extração ou o link é inválido.');
    } finally {
      setIsFetchingUrl(false);
    }
  };

  if (currentView === 'cart') {
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const handleProceedToCheckout = () => {
      if (cartItems.length === 0) return;
      if (!isLoggedIn) {
        alert('Faça login para finalizar sua compra!');
        setCurrentView('login');
        return;
      }
      setCurrentView('checkout');
    };

    return (
      <div className="min-h-screen bg-transparent text-white font-sans flex flex-col items-center p-6 w-full max-w-7xl mx-auto">
        {/* Header Simples */}
        <div className="w-full border-b border-gray-800 pb-4 mb-10 flex justify-between items-center">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('catalog')}>
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full border-2 border-[#ff6b00]" />
          </div>
          <button onClick={() => setCurrentView('catalog')} className="text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors">
            VOLTAR AO CATÁLOGO
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-10 text-left w-full">
          SEU <span className="text-[#00e5ff]">CARRINHO</span>
        </h1>

        <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
          {/* Items List */}
          <div className="w-full lg:w-2/3 bg-black/60 border-t-2 border-[#00e5ff]/50 border-r border-l border-b border-gray-800 rounded p-6 shadow-xl backdrop-blur-sm">
            {cartItems.length === 0 ? (
              <div className="text-gray-500 font-bold p-10 text-center">SEU CARRINHO ESTÁ VAZIO</div>
            ) : (
              <div className="flex flex-col gap-6">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center border-b border-gray-800/50 pb-4 last:border-0 last:pb-0">
                    <img src={item.image} alt={item.title} className="w-16 h-auto aspect-[3/4] object-cover rounded shadow shadow-white/10" />
                    <div className="flex-grow flex flex-col">
                      <span className="font-black text-white text-lg leading-tight uppercase relative group cursor-default">{item.title}</span>
                      <span className="text-gray-500 text-xs font-mono mb-3">{item.platform}</span>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 border border-gray-700 rounded px-2 py-1 select-none">
                          <button 
                            onClick={() => setCartItems(p => p.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
                            className="text-gray-400 hover:text-white pb-1"
                          >-</button>
                          <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                          <button 
                            onClick={() => setCartItems(p => p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))}
                            className="text-gray-400 hover:text-white pb-1"
                          >+</button>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-[#00ff44] font-black text-xl">R$ {(item.price * item.qty).toFixed(2)}</span>
                          <button 
                            onClick={() => setCartItems(p => p.filter(i => i.id !== item.id))}
                            className="text-[#ff6b00] hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resumo */}
          <div className="w-full lg:w-1/3 bg-black/80 border border-gray-800 rounded p-6 sticky top-24">
            <h2 className="text-xl font-black uppercase mb-6 text-white tracking-widest">RESUMO</h2>
            
            <div className="flex justify-between items-center mb-4 text-gray-400 text-sm font-mono border-b border-gray-800 pb-4">
              <span>Subtotal</span>
              <span>R$ {totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-8 font-black text-xl">
              <span className="text-white">Total</span>
              <span className="text-[#00ff44]">R$ {totalAmount.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleProceedToCheckout}
              disabled={cartItems.length === 0}
              className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 rounded hover:bg-cyan-300 transition-colors tracking-widest flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              FINALIZAR COMPRA &rarr;
            </button>
            <button 
              onClick={() => setCurrentView('catalog')}
              className="w-full bg-transparent text-white font-bold uppercase py-4 rounded hover:bg-white/5 transition-colors tracking-widest text-sm"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'checkout') {
    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    
    const handleConfirmPedido = async () => {
      if (cartItems.length === 0) return;
      if (!checkoutData.nome || checkoutData.cpf.length !== 11) {
        alert('Nome completo e CPF (11 números) são OBRIGATÓRIOS para compras via Mercado Pago!');
        return;
      }

      setIsProcessingPIX(true);

      const orderNumberHex = Math.random().toString(16).slice(2, 10).toUpperCase();

      try {
        const res = await fetch('http://localhost:3001/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total: totalAmount,
            clientEmail: loggedInEmail || emailInput || 'cliente@site.com',
            orderNumber: orderNumberHex,
            items: cartItems.map(i => ({ ...i, name: i.title })),
            payerInfo: { name: checkoutData.nome, cpf: checkoutData.cpf }
          })
        });

        const data = await res.json();

        if (!res.ok) {
           alert(`Mercado Pago retornou um Erro!\n\nMotivo: ${data.details || data.error || 'Desconhecido'}\n\nVerifique as Credenciais PIX no .env`);
           return;
        }
        
        if (data.qr_code_base64 || data.mock) {
          setPixPayload({
             ...data,
             orderNumber: orderNumberHex
          });
        }

      } catch (err) {
        console.error('Falha de conexão com o painel PIX:', err);
        alert('Erro de conexão com o Mercado Pago. O servidor (server.js) está rodando localmente?');
      } finally {
        setIsProcessingPIX(false);
      }
    };

    const runFinalCheckoutStorage = () => {
       const finalOrder = {
          id: Date.now(),
          orderNumber: pixPayload?.orderNumber || Math.random().toString(16).slice(2, 10).toUpperCase(),
          clientEmail: loggedInEmail || emailInput || 'cliente@site.com',
          date: new Date().toLocaleString('pt-BR'),
          total: totalAmount,
          items: cartItems.map(i => ({ ...i, name: i.title })),
          status: 'AGUARDANDO',
          clientInfo: checkoutData
       };
       setPedidosList(prev => [finalOrder, ...prev]);
       setCartItems([]);
       setPixPayload(null);
       alert(`Pedido #${finalOrder.orderNumber} confirmado e aguardando pagamento!`);
       setCurrentView('account');
    };

    if (pixPayload) {
      return (
        <div className="min-h-screen bg-transparent text-white font-sans flex flex-col items-center p-6 w-full max-w-lg mx-auto mt-10">
          <div className="w-full bg-[#0a0a0a] border border-[#00e5ff] rounded p-8 flex flex-col items-center shadow-[0_0_30px_rgba(0,229,255,0.2)]">
             <h2 className="text-2xl font-black uppercase mb-2 text-white">ESCANEIE O QR CODE</h2>
             <p className="text-gray-400 font-mono text-center text-xs mb-8">
               Abra o app do seu banco, escolha <strong>PIX -&gt; Ler QR Code</strong> e aponte a câmera.
             </p>
             <div className="bg-white p-4 rounded-md mb-6 relative">
               <img src={`data:image/jpeg;base64,${pixPayload.qr_code_base64}`} alt="QR Code Pix" className="w-48 h-48 object-contain" />
             </div>
             
             <div className="w-full flex justify-between tracking-widest text-[#00ff44] border-b border-gray-800 pb-2 mb-4">
                <span className="font-bold text-sm">TOTAL:</span>
                <span className="font-black text-xl">R$ {totalAmount.toFixed(2)}</span>
             </div>
             <p className="text-gray-500 font-mono text-[10px] break-all border border-gray-800 p-2 rounded mb-6 text-center w-full">
               {pixPayload.qr_code.slice(0, 40)}...
             </p>

             <button
               onClick={() => navigator.clipboard.writeText(pixPayload.qr_code).then(() => alert('Código Copia e Cola salvo na área de transferência!'))}
               className="w-full bg-transparent border border-[#00e5ff] text-[#00e5ff] font-black uppercase py-3 rounded hover:bg-[#00e5ff]/10 transition-colors tracking-widest text-sm mb-4"
             >
               USAR PIX COPIA E COLA
             </button>

             <button
               onClick={runFinalCheckoutStorage}
               className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 rounded hover:bg-cyan-300 transition-colors tracking-widest flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.2)]"
             >
               JÁ EFETUEI O PAGAMENTO
             </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-transparent text-white font-sans flex flex-col items-center p-6 w-full max-w-4xl mx-auto">
        <div className="w-full border-b border-gray-800 pb-4 mb-8 flex justify-between items-center bg-black/40 backdrop-blur-md px-6 rounded">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('catalog')}>
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full border-2 border-[#ff6b00]" />
          </div>
          <button onClick={() => setCurrentView('cart')} className="text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors">
            VOLTAR AO CARRINHO
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8 text-left w-full">
          FINALIZAR <span className="text-[#ff6b00]">COMPRA</span>
        </h1>

        <div className="w-full bg-[#0a0a0a] border-t border-gray-800 border-r border-l border-b rounded p-4 md:p-8 shadow-xl">
           <h2 className="text-md font-black uppercase mb-6 text-white tracking-widest border-b border-gray-800 pb-4">RESUMO DO PEDIDO</h2>
           <div className="flex flex-col gap-4 mb-4 border-b border-gray-800/50 pb-6">
             {cartItems.map((item, idx) => (
               <div key={idx} className="flex justify-between items-start">
                 <div>
                   <span className="font-bold text-gray-300 text-sm md:text-base leading-tight block">{item.title}</span>
                   <span className="text-gray-500 text-[10px] font-mono mt-0.5 block">Quantidade: {item.qty}</span>
                 </div>
                 <span className="text-[#00ff44] font-black text-sm md:text-base whitespace-nowrap">R$ {(item.price * item.qty).toFixed(2)}</span>
               </div>
             ))}
           </div>
           
           <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
              <span className="text-white font-black text-xl">Total</span>
              <span className="text-[#00ff44] font-black text-xl md:text-2xl">R$ {totalAmount.toFixed(2)}</span>
           </div>

           <h2 className="text-sm font-black uppercase mb-6 text-white flex items-center gap-2">
             <span className="text-[#00e5ff]"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></span>
             INFORMAÇÕES DE ENTREGA (OPCIONAL)
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 border-b border-gray-800 pb-10">
             <div className="flex flex-col">
               <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">NOME COMPLETO <span className="text-[#00e5ff]">*</span></label>
               <input type="text" value={checkoutData.nome} onChange={e => setCheckoutData({...checkoutData, nome: e.target.value})} placeholder="Seu nome" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-[#00e5ff] transition-colors text-white" />
             </div>
             <div className="flex flex-col">
               <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">CPF <span className="text-[#00e5ff]">*</span></label>
               <input type="text" value={checkoutData.cpf} onChange={e => setCheckoutData({...checkoutData, cpf: e.target.value.replace(/\D/g, '')})} maxLength={11} placeholder="Apenas números" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-[#00e5ff] transition-colors text-white" />
             </div>
             <div className="flex flex-col md:col-span-2">
               <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">TELEFONE</label>
               <input type="text" value={checkoutData.telefone} onChange={e => setCheckoutData({...checkoutData, telefone: e.target.value})} placeholder="(11) 99999-9999" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-[#00e5ff] transition-colors text-white" />
             </div>
             
             <div className="flex flex-col md:col-span-1">
               <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">CEP</label>
               <input type="text" placeholder="00000-000" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-gray-500 transition-colors text-white" />
             </div>
             <div className="flex flex-col md:col-span-1">
               <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">ENDEREÇO</label>
               <input type="text" placeholder="Rua, Avenida, etc" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-gray-500 transition-colors text-white" />
             </div>

             <div className="flex flex-col">
               <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">NÚMERO</label>
               <input type="text" placeholder="123" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-gray-500 transition-colors text-white" />
             </div>
             <div className="flex flex-col">
               <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">COMPLEMENTO</label>
               <input type="text" placeholder="Apto, Bloco, etc (opcional)" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-gray-500 transition-colors text-white" />
             </div>

             <div className="flex flex-col">
               <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">BAIRRO</label>
               <input type="text" placeholder="Seu bairro" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-gray-500 transition-colors text-white" />
             </div>
             <div className="flex flex-col sm:flex-row gap-4 md:col-span-1">
               <div className="flex flex-col flex-grow">
                 <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">CIDADE</label>
                 <input type="text" placeholder="Sua cidade" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-gray-500 transition-colors text-white" />
               </div>
               <div className="flex flex-col w-20 shrink-0">
                 <label className="text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">ESTADO</label>
                 <input type="text" placeholder="SP" className="bg-black border border-gray-800 rounded px-4 py-2 text-xs focus:outline-none focus:border-gray-500 transition-colors text-white" />
               </div>
             </div>
             
             <p className="text-[9px] font-mono text-gray-600 mt-1 md:col-span-2">
               Preencha os campos de endereço para entrega física (opcional).
             </p>
           </div>

           <h2 className="text-md font-black uppercase mb-4 text-white">PAGAMENTO VIA PIX</h2>
           <div className="border border-[#00e5ff]/30 bg-black/40 p-6 md:p-8 rounded relative">
             <p className="text-[10px] md:text-xs font-mono text-gray-400 mb-6 font-bold text-center">
               Após confirmar o pedido, você receberá um QR Code PIX para realizar o pagamento.
             </p>
             <button
               onClick={handleConfirmPedido}
               disabled={isProcessingPIX}
               className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 rounded hover:bg-cyan-300 transition-colors tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.2)] disabled:opacity-50"
             >
               {isProcessingPIX ? 'GERANDO PIX...' : 'CONFIRMAR PEDIDO E GERAR PIX'}
             </button>
           </div>
        </div>
      </div>
    );
  }

  if (currentView === 'account') {
    const myOrders = pedidosList.filter(p => p.clientEmail === (loggedInEmail || emailInput));

    return (
      <div className="min-h-screen bg-transparent text-white font-sans flex flex-col items-center p-6 w-full max-w-7xl mx-auto">
        <div className="w-full border-b border-gray-800 pb-4 mb-10 flex justify-between items-center bg-black/40 backdrop-blur-md px-6 rounded">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('catalog')}>
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full border-2 border-[#00e5ff]" />
          </div>
          <button onClick={() => setCurrentView('catalog')} className="text-gray-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors">
            VOLTAR AO CATÁLOGO
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-10 text-left w-full">
          MINHA <span className="text-[#00e5ff]">CONTA</span>
        </h1>

        <div className="w-full flex flex-col lg:flex-row gap-8 items-start">
          {/* Histórico de Compras */}
          <div className="w-full lg:w-2/3 bg-black/60 border-t-2 border-[#00e5ff]/50 border-r border-l border-b border-gray-800 rounded p-6 shadow-xl backdrop-blur-sm">
             <h2 className="text-xl font-black uppercase mb-6 text-white tracking-widest border-b border-gray-800 pb-4">HISTÓRICO DE COMPRAS</h2>
             
             {myOrders.length === 0 ? (
               <div className="text-gray-500 font-bold p-10 text-center">NENHUMA COMPRA REALIZADA AINDA.</div>
             ) : (
               <div className="flex flex-col gap-6">
                 {myOrders.map(order => (
                   <div key={order.id} className="bg-[#111] border border-gray-800 rounded p-4">
                     <div className="flex justify-between items-center border-b border-gray-800/50 pb-3 mb-3">
                       <span className="font-mono text-gray-500 text-xs">Pedido #{order.orderNumber}</span>
                       <span className={`px-2 py-1 rounded text-xs font-black ${order.status === 'PAGO' ? 'bg-[#00ff44]/20 text-[#00ff44]' : order.status === 'RECUSADO' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-400'}`}>
                         {order.status}
                       </span>
                     </div>
                     <div className="flex flex-col gap-4 mb-4">
                       {order.items.map((item: any, i: number) => (
                         <div key={i} className="flex gap-4 items-center bg-black/40 border border-gray-800/50 rounded p-3">
                           {item.image && 
                             <img src={item.image} alt={item.name || item.title} className="w-12 h-auto aspect-[3/4] object-cover rounded shadow shadow-white/10" />
                           }
                           <div className="flex-grow flex flex-col">
                             <span className="font-black text-white text-md leading-tight uppercase cursor-default">{item.name || item.title}</span>
                             <span className="text-gray-500 text-[10px] font-mono mb-2">{item.platform || "CONSOLE"}</span>
                             <div className="flex items-center justify-between mt-auto">
                               <span className="text-sm font-bold text-gray-400">{item.qty} UNIDADE(S)</span>
                               <span className="text-[#00ff44] font-black text-lg">R$ {(item.price * item.qty).toFixed(2)}</span>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                     <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500">{order.date}</span>
                       <span className="font-black text-[#00ff44]">Total: R$ {order.total.toFixed(2)}</span>
                     </div>
                     <div className="mt-4 pt-4 border-t border-gray-800/50 flex justify-end">
                       <button
                         onClick={() => {
                            setActiveChatOrderId(order.id);
                            if (order.hasUnreadCliente) {
                              setPedidosList(prev => prev.map(p => p.id === order.id ? { ...p, hasUnreadCliente: false } : p));
                            }
                         }}
                         className="relative py-1.5 px-3 flex items-center justify-center gap-2 rounded border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-colors text-[10px] font-bold uppercase"
                       >
                         <MessageCircle size={12} /> Conversar
                         {order.hasUnreadCliente && (
                           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]">!</span>
                         )}
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>

          {/* Alterar Senha */}
          <div className="w-full lg:w-1/3 bg-black/80 border border-gray-800 rounded p-6 sticky top-24">
             <h2 className="text-xl font-black uppercase mb-6 text-white tracking-widest border-b border-gray-800 pb-4">SEGURANÇA</h2>
             
             <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">NOVA SENHA</label>
                  <div className="relative">
                    <input
                      type={showAccountNewPassword ? "text" : "password"}
                      value={accountNewPassword}
                      onChange={(e) => setAccountNewPassword(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountNewPassword(!showAccountNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showAccountNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">CONFIRMAR NOVA SENHA</label>
                  <div className="relative">
                    <input
                      type={showAccountConfirmPassword ? "text" : "password"}
                      value={accountConfirmPassword}
                      onChange={(e) => setAccountConfirmPassword(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountConfirmPassword(!showAccountConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {showAccountConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
             </div>

             <button 
               onClick={handleChangePassword}
               className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 rounded hover:bg-cyan-300 transition-colors tracking-widest flex items-center justify-center gap-2"
             >
               ALTERAR SENHA
             </button>
          </div>
        </div>
        {renderChatModal()}
      </div>
    );
  }

  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-transparent text-white font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">LOGIN</h1>
            <p className="text-gray-400 font-mono text-sm">Games Nostálgicos</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">EMAIL</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">SENHA</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-[#00e5ff] text-black font-black uppercase py-3.5 rounded-md hover:bg-cyan-400 transition-colors mt-8 tracking-wider"
            >
              ENTRAR
            </button>

            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentView('register')}
                className="text-gray-500 font-mono text-sm hover:text-gray-300 transition-colors"
              >
                Não tem conta? Cadastre-se
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'register') {
    return (
      <div className="min-h-screen bg-transparent text-white font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-md border border-gray-800 p-8 rounded-md bg-[#0a0a0a]">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-2">CADASTRO</h1>
            <p className="text-gray-400 font-mono text-sm">Games Nostálgicos</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">NOME</label>
              <input
                type="text"
                className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">EMAIL</label>
              <input
                type="email"
                className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">SENHA</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-black border border-gray-800 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setIsLoggedIn(true);
                setCurrentView('catalog');
              }}
              className="w-full bg-[#00e5ff] text-black font-black uppercase py-3.5 rounded-md hover:bg-cyan-400 transition-colors mt-8 tracking-wider"
            >
              CADASTRAR
            </button>

            <div className="text-center mt-8">
              <button
                onClick={() => setCurrentView('login')}
                className="text-gray-500 font-mono text-sm hover:text-gray-300 transition-colors"
              >
                Já tem conta? Faça login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-transparent text-white font-sans flex flex-col">
        {/* Admin Header */}
        <header className="border-b border-gray-800 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('catalog')}>
            <img
              src="/logo.png"
              alt="Games Nostálgicos"
              className="w-16 h-16 rounded-full border-4 border-[#ff6b00] shadow-[0_0_15px_rgba(255,107,0,0.5)] object-cover bg-white"
            />
          </div>
          <nav className="flex items-center gap-6 text-xs font-bold tracking-wider text-gray-400">
            <button onClick={() => setCurrentView('catalog')} className="hover:text-white transition-colors uppercase">CATÁLOGO</button>
            <div className="flex items-center gap-2 text-[#ff6b00] uppercase">
              <Shield size={16} />
              ADMIN
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors uppercase cursor-pointer">
              <User size={16} />
              PEDIDOS
            </div>
            <button
              onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setCurrentView('catalog'); }}
              className="hover:text-white transition-colors"
            >
              <LogOut size={16} />
            </button>
            <button
              onClick={() => setCurrentView('cart')}
              className="relative hover:text-white transition-colors"
            >
              <ShoppingCart size={16} />
              {cartTotalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff6b00] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,107,0,0.5)]">
                  {cartTotalQty}
                </span>
              )}
            </button>
          </nav>
        </header>

        {/* Admin Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-grow">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-10">
            PAINEL <span className="text-[#ff6b00]">ADMIN</span>
          </h1>

          {/* Tabs */}
          <div className="inline-flex flex-wrap items-center gap-6 border border-gray-800 rounded-md px-4 py-3 mb-10 text-sm font-mono text-gray-400">
            <div
              onClick={() => setAdminActiveTab('pedidos')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${adminActiveTab === 'pedidos' ? 'text-white' : 'hover:text-white'}`}
            >
              <Package size={16} /> PEDIDOS ({pedidosList.length})
              {pedidosList.filter(p => p.status === 'AGUARDANDO').length > 0 && (
                <span className="bg-[#ff6b00] text-white text-[10px] rounded w-4 h-4 flex items-center justify-center font-sans font-bold ml-1">
                  {pedidosList.filter(p => p.status === 'AGUARDANDO').length}
                </span>
              )}
            </div>
            <div
              onClick={() => setAdminActiveTab('usuarios')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${adminActiveTab === 'usuarios' ? 'text-white' : 'hover:text-white'}`}
            >
              <Users size={16} /> USUÁRIOS ({usersList.length})
            </div>
            <div
              onClick={() => setAdminActiveTab('jogos')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${adminActiveTab === 'jogos' ? 'text-white' : 'hover:text-white'}`}
            >
              <Package size={16} /> JOGOS ({gamesList.length})
            </div>
            <div
              onClick={() => setAdminActiveTab('consoles')}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${adminActiveTab === 'consoles' ? 'text-white' : 'hover:text-white'}`}
            >
              <Gamepad2 size={16} /> CONSOLES (7)
            </div>
          </div>

          {adminActiveTab === 'jogos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsAddingGame(true)}
                  className="bg-[#00e5ff] text-black font-black uppercase py-2.5 px-6 rounded flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors text-sm tracking-wider shrink-0"
                >
                  <Plus size={18} strokeWidth={3} /> ADICIONAR JOGO
                </button>

                {/* Filtros Admin */}
                <div className="flex flex-grow flex-col sm:flex-row gap-4">
                  <div className="flex flex-grow bg-[#111] border border-gray-800 rounded px-4 py-2 items-center focus-within:border-[#00e5ff] transition-colors">
                    <Search size={18} className="text-gray-500 mr-2 shrink-0" />
                    <input 
                      type="text"
                      placeholder="Buscar por nome..."
                      value={adminGameSearch}
                      onChange={(e) => setAdminGameSearch(e.target.value)}
                      className="bg-transparent w-full focus:outline-none text-sm text-white placeholder-gray-600"
                    />
                  </div>
                  <select 
                    value={adminGameFilter}
                    onChange={(e) => setAdminGameFilter(e.target.value)}
                    className="bg-[#111] border border-gray-800 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00e5ff] transition-colors shrink-0 appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2rem' }}
                  >
                    <option value="TODOS">Todos os Consoles</option>
                    {consolesList.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-[#111] border border-gray-800 rounded-md p-6">
                {gamesList.length === 0 ? (
                  <div className="text-center text-gray-500 py-10 font-mono text-sm">
                    Nenhum jogo cadastrado. Adicione seu primeiro jogo!
                  </div>
                ) : (() => {
                  const adminFilteredGames = gamesList.filter(g => {
                    const matchesSearch = g.title.toLowerCase().includes(adminGameSearch.toLowerCase());
                    const matchesConsole = adminGameFilter === 'TODOS' ? true : g.platform === adminGameFilter;
                    return matchesSearch && matchesConsole;
                  });

                  if (adminFilteredGames.length === 0) {
                     return (
                       <div className="text-center text-gray-500 py-10 font-mono text-sm">
                         Nenhum jogo encontrado para este filtro.
                       </div>
                     );
                  }

                  return (
                    <div className="flex flex-col gap-4">
                      {adminFilteredGames.map((game) => (
                      <div key={game.id} className="bg-black border border-gray-800 rounded-md overflow-hidden flex flex-col sm:flex-row group relative hover:border-gray-600 transition-colors">
                        
                        {/* Capa */}
                        <div className="relative w-full sm:w-32 shrink-0 aspect-[16/9] sm:aspect-auto sm:h-auto bg-gray-900 border-b sm:border-b-0 sm:border-r border-gray-800">
                          <img
                            src={game.image}
                            alt={game.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Detalhes & Actions */}
                        <div className="p-4 flex flex-col flex-grow gap-4 justify-between w-full">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                               <h3 className="text-base font-black uppercase text-white tracking-tight mb-1 leading-tight">{game.title}</h3>
                               <p className="text-gray-400 font-mono text-[10px] uppercase">Plataforma: <span className="text-gray-300">{game.platform}</span></p>
                            </div>
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 w-full sm:w-auto">
                               <p className="text-[#00ff44] font-bold text-sm">R$ {Number(game.price).toFixed(2)}</p>
                               <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-wider rounded uppercase ${(game.status || 'ATIVO') === 'ATIVO'
                                 ? 'border-[#00ff44] text-[#00ff44] bg-[#00ff44]/10'
                                 : 'border-red-500 text-red-500 bg-red-500/10'
                                 }`}>
                                 {game.status || 'ATIVO'}
                               </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 justify-end mt-auto pt-2 sm:pt-0">
                            <button
                              onClick={() => {
                                const updated = gamesList.map(g =>
                                  g.id === game.id
                                    ? { ...g, status: (g.status || 'ATIVO') === 'ATIVO' ? 'INATIVO' : 'ATIVO' }
                                    : g
                                );
                                setGamesList(updated);
                              }}
                              className={`py-1.5 px-3 flex items-center justify-center gap-2 rounded border transition-colors text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)] ${(game.status || 'ATIVO') === 'INATIVO'
                                ? 'border-[#00ff44] text-[#00ff44] hover:bg-[#00ff44]/10 hover:shadow-[0_0_15px_rgba(0,255,68,0.2)]'
                                : 'border-[#b58900] text-[#b58900] hover:bg-[#b58900]/10 hover:shadow-[0_0_15px_rgba(181,137,0,0.2)]'
                                }`}
                            >
                              {(game.status || 'ATIVO') === 'INATIVO' ? 'Ativar' : 'Desativar'}
                            </button>
                            <button
                              onClick={() => setEditingGame(game)}
                              className="py-1.5 px-3 flex items-center justify-center gap-2 rounded border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-colors text-[10px] font-bold uppercase"
                            >
                              <Edit size={12} /> Editar
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja excluir "${game.title}"?`)) {
                                  setGamesList(gamesList.filter(g => g.id !== game.id));
                                }
                              }}
                              className="py-1.5 px-3 flex items-center justify-center gap-2 rounded border border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00]/10 hover:shadow-[0_0_15px_rgba(255,107,0,0.2)] transition-colors text-[10px] font-bold uppercase"
                            >
                              <Trash2 size={12} /> Excluir
                            </button>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
           )}

          {adminActiveTab === 'consoles' && (
            <div className="space-y-6">
              <button className="bg-[#00e5ff] text-black font-black uppercase py-2.5 px-6 rounded flex items-center gap-2 hover:bg-cyan-400 transition-colors text-sm tracking-wider">
                <Plus size={18} strokeWidth={3} /> ADICIONAR CONSOLE
              </button>

              <div className="flex flex-col gap-4">
                {consolesList.map((console) => (
                  <div key={console.id} className="bg-black border border-gray-800 rounded-md overflow-hidden flex flex-col sm:flex-row group relative hover:border-gray-600 transition-colors">
                    
                    {/* Capa */}
                    <div className="relative w-full sm:w-32 shrink-0 aspect-[16/9] sm:aspect-auto sm:h-auto bg-gray-900 border-b sm:border-b-0 sm:border-r border-gray-800">
                      <img
                        src={console.image}
                        alt={console.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Detalhes & Actions */}
                    <div className="p-4 flex flex-col flex-grow gap-4 justify-between w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                           <h3 className="text-base font-black uppercase text-white tracking-tight mb-1 leading-tight">{console.name}</h3>
                           <p className="text-gray-400 font-mono text-[10px] uppercase">Slug: <span className="text-gray-300">{console.slug}</span></p>
                           <p className="text-gray-400 font-mono text-[10px] uppercase mt-0.5 mb-1">
                             Jogos Cadastrados: <span className="text-[#00e5ff] font-bold">{gamesList.filter(g => g.platform === console.slug).length}</span>
                           </p>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 w-full sm:w-auto">
                           <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-wider rounded uppercase ${(console.status || 'ATIVO') === 'ATIVO'
                             ? 'border-[#00ff44] text-[#00ff44] bg-[#00ff44]/10'
                             : 'border-red-500 text-red-500 bg-red-500/10'
                             }`}>
                             {console.status || 'ATIVO'}
                           </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 justify-end mt-auto pt-2 sm:pt-0">
                        <button
                          onClick={() => {
                            const newStatus = (console.status || 'ATIVO') === 'ATIVO' ? 'INATIVO' : 'ATIVO';

                            const updatedConsoles = consolesList.map(c =>
                              c.id === console.id
                                ? { ...c, status: newStatus }
                                : c
                            );
                            setConsolesList(updatedConsoles);

                            const updatedGames = gamesList.map(g =>
                              g.platform === console.slug
                                ? { ...g, status: newStatus }
                                : g
                            );
                            setGamesList(updatedGames);
                          }}
                          className={`py-1.5 px-3 flex items-center justify-center gap-2 rounded border transition-colors text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)] ${(console.status || 'ATIVO') === 'INATIVO'
                            ? 'border-[#00ff44] text-[#00ff44] hover:bg-[#00ff44]/10 hover:shadow-[0_0_15px_rgba(0,255,68,0.2)]'
                            : 'border-[#b58900] text-[#b58900] hover:bg-[#b58900]/10 hover:shadow-[0_0_15px_rgba(181,137,0,0.2)]'
                            }`}
                        >
                          {(console.status || 'ATIVO') === 'INATIVO' ? 'Ativar' : 'Desativar'}
                        </button>
                        <button
                          onClick={() => setEditingConsole(console)}
                          className="py-1.5 px-3 flex items-center justify-center gap-2 rounded border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-colors text-[10px] font-bold uppercase"
                        >
                          <Edit size={12} /> Editar
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir o console "${console.name}"?`)) {
                              setConsolesList(consolesList.filter(c => c.id !== console.id));
                            }
                          }}
                          className="py-1.5 px-3 flex items-center justify-center gap-2 rounded border border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00]/10 hover:shadow-[0_0_15px_rgba(255,107,0,0.2)] transition-colors text-[10px] font-bold uppercase"
                        >
                          <Trash2 size={12} /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminActiveTab === 'usuarios' && (
            <div className="space-y-6">
              <button className="bg-[#00e5ff] text-black font-black uppercase py-2.5 px-6 rounded flex items-center gap-2 hover:bg-cyan-400 transition-colors text-sm tracking-wider">
                <Plus size={18} strokeWidth={3} /> ADICIONAR USUÁRIO
              </button>

              <div className="flex flex-col gap-4">
                {usersList.map((user) => (
                  <div key={user.id} className="bg-black border border-gray-800 rounded-md overflow-hidden flex flex-col sm:flex-row group relative hover:border-gray-600 transition-colors">
                    
                    {/* Avatar Simulado */}
                    <div className="relative w-full sm:w-24 shrink-0 aspect-square bg-[#111] border-b sm:border-b-0 sm:border-r border-gray-800 flex items-center justify-center">
                       <User size={40} className="text-gray-600" />
                    </div>

                    {/* Detalhes & Actions */}
                    <div className="p-4 flex flex-col flex-grow gap-4 justify-between w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                           <h3 className="text-base font-black uppercase text-white tracking-tight mb-1 leading-tight">{user.name}</h3>
                           <p className="text-gray-400 font-mono text-[10px] uppercase">E-Mail: <span className="text-gray-300">{user.email}</span></p>
                           <p className="text-gray-400 font-mono text-[10px] uppercase mt-0.5">Cadastrado em: <span className="text-gray-300">{user.registeredAt}</span></p>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 w-full sm:w-auto">
                           <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-wider rounded uppercase ${(user.role === 'ADMIN') 
                             ? 'border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/10' 
                             : 'border-gray-500 text-gray-500 bg-gray-500/10'}`}>
                             {user.role}
                           </span>
                           <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-wider rounded uppercase ${(user.status || 'ATIVO') === 'ATIVO'
                             ? 'border-[#00ff44] text-[#00ff44] bg-[#00ff44]/10'
                             : 'border-red-500 text-red-500 bg-red-500/10'
                             }`}>
                             {user.status || 'ATIVO'}
                           </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 justify-end mt-auto pt-2 sm:pt-0">
                        <button
                          onClick={() => {
                            const updated = usersList.map(u =>
                              u.id === user.id
                                ? { ...u, status: (u.status || 'ATIVO') === 'ATIVO' ? 'INATIVO' : 'ATIVO' }
                                : u
                            );
                            setUsersList(updated);
                          }}
                          className={`py-1.5 px-3 flex items-center justify-center gap-2 rounded border transition-colors text-[10px] font-bold uppercase shadow-[0_0_10px_rgba(0,0,0,0.5)] ${(user.status || 'ATIVO') === 'INATIVO'
                            ? 'border-[#00ff44] text-[#00ff44] hover:bg-[#00ff44]/10 hover:shadow-[0_0_15px_rgba(0,255,68,0.2)]'
                            : 'border-[#b58900] text-[#b58900] hover:bg-[#b58900]/10 hover:shadow-[0_0_15px_rgba(181,137,0,0.2)]'
                            }`}
                        >
                          {(user.status || 'ATIVO') === 'INATIVO' ? 'Reativar' : 'Bloquear'}
                        </button>
                        <button
                          className="py-1.5 px-3 flex items-center justify-center gap-2 rounded border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-colors text-[10px] font-bold uppercase cursor-not-allowed opacity-50"
                          title="Funcionalidade em breve"
                        >
                          <Edit size={12} /> Editar
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`)) {
                              setUsersList(usersList.filter(u => u.id !== user.id));
                            }
                          }}
                          className="py-1.5 px-3 flex items-center justify-center gap-2 rounded border border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00]/10 hover:shadow-[0_0_15px_rgba(255,107,0,0.2)] transition-colors text-[10px] font-bold uppercase"
                        >
                          <Trash2 size={12} /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {adminActiveTab === 'pedidos' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4">
                {pedidosList.map((pedido) => (
                  <div key={pedido.id} className="bg-black border border-gray-800 rounded-md overflow-hidden flex flex-col sm:flex-row group relative hover:border-gray-600 transition-colors">
                    
                    {/* Capa do Pedido */}
                    <div className="relative w-full sm:w-24 shrink-0 aspect-square sm:aspect-[3/4] sm:min-h-full bg-[#111] border-b sm:border-b-0 sm:border-r border-gray-800 overflow-hidden">
                       {pedido.items[0]?.image ? (
                         <img src={pedido.items[0].image} alt="Capa" className="w-full h-full object-cover" />
                       ) : (
                         <div className="flex items-center justify-center w-full h-full">
                           <Package size={32} className="text-gray-600" />
                         </div>
                       )}
                    </div>

                    {/* Detalhes & Actions */}
                    <div className="p-4 flex flex-col flex-grow gap-3 justify-between w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div>
                           <h3 className="text-base font-black uppercase text-white tracking-tight mb-1 leading-tight">PEDIDO #{pedido.orderNumber}</h3>
                           <p className="text-gray-400 font-mono text-[10px] uppercase">Cliente: <span className="text-gray-300">{pedido.clientEmail}</span></p>
                           <p className="text-gray-400 font-mono text-[10px] uppercase mt-0.5">Data: <span className="text-gray-300">{pedido.date}</span></p>
                           {pedido.clientInfo && (
                             <div className="mt-3 bg-gray-900/50 border border-gray-800 rounded p-3 text-[9px] font-mono text-gray-400 break-all leading-relaxed">
                               <p><strong className="text-[#00e5ff] tracking-wider uppercase">Nome:</strong> {pedido.clientInfo.nome} <span className="mx-2 text-gray-700">|</span> <strong className="text-[#00e5ff] tracking-wider uppercase">CPF:</strong> {pedido.clientInfo.cpf} <span className="mx-2 text-gray-700">|</span> <strong className="text-[#00e5ff] tracking-wider uppercase">Tel:</strong> {pedido.clientInfo.telefone}</p>
                               <p className="mt-1"><strong className="text-[#00e5ff] tracking-wider uppercase">CEP:</strong> {pedido.clientInfo.cep} <span className="mx-2 text-gray-700">|</span> <strong className="text-[#00e5ff] tracking-wider uppercase">Rua:</strong> {pedido.clientInfo.endereco}, {pedido.clientInfo.numero}</p>
                               <p className="mt-1"><strong className="text-[#00e5ff] tracking-wider uppercase">Compl:</strong> {pedido.clientInfo.complemento || 'N/A'} <span className="mx-2 text-gray-700">|</span> <strong className="text-[#00e5ff] tracking-wider uppercase">Bairro:</strong> {pedido.clientInfo.bairro}</p>
                               <p className="mt-1"><strong className="text-[#00e5ff] tracking-wider uppercase">Cidade/UF:</strong> {pedido.clientInfo.cidade} - {pedido.clientInfo.estado}</p>
                             </div>
                           )}
                           <div className="flex flex-col gap-3 mt-4 text-gray-500 font-mono text-[10px] uppercase">
                             {pedido.items.map((item: any, idx: number) => (
                               <div key={idx} className="flex gap-3 items-center bg-gray-900/30 border border-gray-800 rounded p-2">
                                 {item.image && 
                                   <img src={item.image} alt={item.name} className="w-8 h-auto aspect-[3/4] object-cover rounded" />
                                 }
                                 <div className="flex flex-col flex-grow">
                                   <span className="text-white font-bold text-xs">{item.name || item.title}</span>
                                   <span className="text-gray-500 text-[9px] font-mono mt-0.5 mb-1">{item.platform || "CONSOLE"}</span>
                                   <div className="flex justify-between items-center mt-auto">
                                     <span className="text-[#00e5ff] font-bold">{item.qty} UNIDADE(S)</span>
                                     <span className="text-[#00ff44] font-black text-xs">R$ {(item.price * item.qty).toFixed(2)}</span>
                                   </div>
                                 </div>
                               </div>
                             ))}
                           </div>
                        </div>
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 w-full sm:w-auto">
                           <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-wider rounded uppercase ${
                             pedido.status === 'PAGO' ? 'border-[#00ff44] text-[#00ff44] bg-[#00ff44]/10' :
                             pedido.status === 'AGUARDANDO' ? 'border-[#b58900] text-[#b58900] bg-[#b58900]/10' :
                             'border-red-500 text-red-500 bg-red-500/10'
                             }`}>
                             {pedido.status}
                           </span>
                           <div className="text-[#00ff44] text-sm lg:text-base font-black mt-1">R$ {Number(pedido.total).toFixed(2)}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 justify-end mt-auto pt-2 border-t border-gray-800/50">
                        <button
                          onClick={() => {
                            setActiveChatOrderId(pedido.id);
                            if (pedido.hasUnreadAdmin) {
                              setPedidosList(prev => prev.map(p => p.id === pedido.id ? { ...p, hasUnreadAdmin: false } : p));
                            }
                          }}
                          className="relative py-1.5 px-3 flex items-center justify-center gap-2 rounded border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff]/10 hover:shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-colors text-[10px] font-bold uppercase"
                        >
                          <MessageCircle size={12} /> Conversar
                          {pedido.hasUnreadAdmin && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]">!</span>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setPedidosList(pedidosList.map(p => p.id === pedido.id ? { ...p, status: 'PAGO' } : p));
                          }}
                          className={`py-1.5 px-3 flex items-center justify-center gap-2 rounded border transition-colors text-[10px] font-bold uppercase ${
                            pedido.status === 'PAGO' 
                              ? 'border-gray-800 text-gray-600 bg-transparent cursor-not-allowed hidden' 
                              : 'border-[#00ff44] text-[#00ff44] hover:bg-[#00ff44]/10 hover:shadow-[0_0_15px_rgba(0,255,68,0.2)]'
                          }`}
                        >
                          <CheckCircle2 size={12} /> Confirmar
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja recusar o pedido #${pedido.orderNumber}?`)) {
                              setPedidosList(pedidosList.map(p => p.id === pedido.id ? { ...p, status: 'RECUSADO' } : p));
                            }
                          }}
                          className={`py-1.5 px-3 flex items-center justify-center gap-2 rounded border transition-colors text-[10px] font-bold uppercase ${
                            pedido.status === 'RECUSADO'
                            ? 'border-gray-800 text-gray-600 bg-transparent cursor-not-allowed hidden'
                            : 'border-[#e22134] text-[#e22134] hover:bg-[#e22134]/10 hover:shadow-[0_0_15px_rgba(226,33,52,0.2)]'
                          }`}
                        >
                          <XCircle size={12} /> Recusar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Modal Editar Console */}
        {editingConsole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#050505] border border-gray-800 rounded-lg w-full max-w-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,1)]">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-800">
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">EDITAR CONSOLE</h2>
                <button
                  onClick={() => setEditingConsole(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <form
                className="p-6 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const updatedConsoles = consolesList.map(c => {
                    if (c.id === editingConsole.id) {
                      return {
                        ...c,
                        name: (form.elements.namedItem('name') as HTMLInputElement).value,
                        slug: (form.elements.namedItem('slug') as HTMLInputElement).value,
                        image: (form.elements.namedItem('image') as HTMLInputElement).value,
                        video: (form.elements.namedItem('video') as HTMLInputElement).value,
                      };
                    }
                    return c;
                  });
                  setConsolesList(updatedConsoles);
                  setEditingConsole(null);
                }}
              >

                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">NOME DO CONSOLE</label>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingConsole.name}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">SLUG (IDENTIFICADOR)</label>
                  <input
                    type="text"
                    name="slug"
                    required
                    defaultValue={editingConsole.slug}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                  <p className="text-gray-500 font-mono text-xs mt-2">Use sigla ou nome curto sem espaços</p>
                </div>

                {/* URL IMAGEM */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">URL DA IMAGEM</label>
                  <input
                    type="text"
                    name="image"
                    required
                    defaultValue={editingConsole.image}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* URL VÍDEO */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">URL DO VÍDEO (YOUTUBE - OPCIONAL)</label>
                  <input
                    type="text"
                    name="video"
                    defaultValue={editingConsole.video || ""}
                    placeholder="Link do YouTube com trailer/review do console"
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans placeholder-gray-600"
                  />
                  <p className="text-gray-500 font-mono text-xs mt-2">Ex: Trailer de lançamento, review, comercial vintage</p>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-gray-800 bg-[#0a0a0a]">
                  <button
                    type="submit"
                    className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 rounded hover:bg-cyan-400 transition-colors tracking-wider text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                  >
                    ATUALIZAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Adicionar Jogo */}
        {/* Modal Editar Jogo */}
        {editingGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
            <div className="bg-[#050505] border border-gray-800 rounded-lg w-full max-w-2xl shadow-[0_0_30px_rgba(0,0,0,1)] flex flex-col my-auto relative">

              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-800 shrink-0">
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">EDITAR JOGO</h2>
                <button
                  onClick={() => setEditingGame(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <form
                className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const updatedGames = gamesList.map(g => {
                    if (g.id === editingGame.id) {
                      return {
                        ...g,
                        title: (form.elements.namedItem('title') as HTMLInputElement).value,
                        platform: (form.elements.namedItem('console') as HTMLSelectElement).value,
                        price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value) || 0,
                        image: (form.elements.namedItem('image') as HTMLInputElement).value,
                        video: (form.elements.namedItem('video') as HTMLInputElement).value,
                        description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
                      };
                    }
                    return g;
                  });
                  setGamesList(updatedGames);
                  setEditingGame(null);
                }}
              >
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">NOME DO JOGO</label>
                  <input
                    type="text"
                    name="title"
                    required
                    defaultValue={editingGame.title}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* Console Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">CONSOLE</label>
                  <select
                    name="console"
                    required
                    defaultValue={editingGame.platform}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    {consolesList.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">PREÇO (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    defaultValue={editingGame.price}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">DESCRIÇÃO</label>
                  <textarea
                    rows={4}
                    name="description"
                    defaultValue={editingGame.description || ''}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans resize-y"
                  />
                </div>

                {/* URL VÍDEO */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">URL DO VÍDEO (YOUTUBE)</label>
                  <input
                    type="text"
                    name="video"
                    defaultValue={editingGame.video || ''}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* URL IMAGEM */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">URL DA IMAGEM</label>
                  <input
                    type="text"
                    name="image"
                    required
                    defaultValue={editingGame.image}
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* Submit / Footer */}
                <div className="pt-4 mt-8 border-t border-gray-800">
                  <button
                    type="submit"
                    className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 rounded hover:bg-cyan-400 transition-colors tracking-wider text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                  >
                    ATUALIZAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isAddingGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
            <div className="bg-[#050505] border border-gray-800 rounded-lg w-full max-w-2xl shadow-[0_0_30px_rgba(0,0,0,1)] flex flex-col my-auto relative">

              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-800 shrink-0">
                <h2 className="text-2xl font-black uppercase text-white tracking-tight">ADICIONAR JOGO</h2>
                <button
                  onClick={() => setIsAddingGame(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Auto-Fill Section */}
              <div className="p-6 pb-0 space-y-3">
                <div className="bg-[#111] border border-[#00e5ff]/30 rounded-lg p-5 flex flex-col sm:flex-row gap-4 items-end shadow-[0_0_15px_rgba(0,229,255,0.05)]">
                  <div className="flex-grow w-full">
                    <label className="block text-xs font-bold text-[#00e5ff] mb-2 uppercase tracking-wider flex items-center gap-2">
                       <DownloadCloud size={14} /> IMPORTAR DADOS VIA LINK (OPCIONAL)
                    </label>
                    <input
                      type="url"
                      placeholder="Cole o link (Steam, PlayStation Store, Wiki, IGDB...)"
                      value={fetchUrl}
                      onChange={(e) => setFetchUrl(e.target.value)}
                      className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans placeholder-gray-600"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchGameData}
                    disabled={isFetchingUrl || !fetchUrl}
                    className="shrink-0 bg-[#00e5ff]/10 border border-[#00e5ff] text-[#00e5ff] font-bold uppercase py-3 px-6 rounded hover:bg-[#00e5ff] hover:text-black transition-all tracking-wider text-xs whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFetchingUrl ? 'BUSCANDO...' : 'BUSCAR DADOS'}
                  </button>
                </div>
              </div>

              {/* Body */}
              <form
                className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const newGame = {
                    id: Date.now(),
                    title: (form.elements.namedItem('title') as HTMLInputElement).value,
                    platform: (form.elements.namedItem('console') as HTMLSelectElement).value,
                    price: parseFloat((form.elements.namedItem('price') as HTMLInputElement).value) || 0,
                    image: (form.elements.namedItem('image') as HTMLInputElement).value,
                    video: (form.elements.namedItem('video') as HTMLInputElement).value,
                    description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
                    status: 'ATIVO',
                  };
                  setGamesList([newGame, ...gamesList]);
                  setIsAddingGame(false);
                }}
              >
                {/* Nome */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">NOME DO JOGO</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* Console Select */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">CONSOLE</label>
                  <select
                    name="console"
                    required
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                  >
                    <option value="" disabled selected hidden>Selecione um console...</option>
                    {consolesList.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">PREÇO (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">DESCRIÇÃO</label>
                  <textarea
                    rows={4}
                    name="description"
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans resize-y"
                  />
                </div>

                {/* URL VÍDEO */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">URL DO VÍDEO (YOUTUBE)</label>
                  <input
                    type="text"
                    name="video"
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* URL IMAGEM */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">URL DA IMAGEM</label>
                  <input
                    type="text"
                    name="image"
                    required
                    className="w-full bg-black border border-gray-800 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors text-white font-sans"
                  />
                </div>

                {/* Submit / Footer Embutido no Form */}
                <div className="pt-4 mt-8 border-t border-gray-800">
                  <button
                    type="submit"
                    className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 rounded hover:bg-cyan-400 transition-colors tracking-wider text-sm shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                  >
                    ADICIONAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {renderChatModal()}
      </div>
    );
  }

  if (currentView === 'game' && selectedGame) {
    const embedVideoUrl = selectedGame.video
      ? selectedGame.video.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
      : null;

    return (
      <div className="min-h-screen bg-transparent text-white font-sans flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('catalog')}>
            <img
              src="/logo.png"
              alt="Games Nostálgicos"
              className="w-16 h-16 rounded-full border-4 border-[#ff6b00] shadow-[0_0_15px_rgba(255,107,0,0.5)] object-cover bg-white"
            />
          </div>
          <nav className="flex items-center gap-6 text-xs font-bold tracking-wider text-gray-400">
            <button onClick={() => setCurrentView('catalog')} className="text-white transition-colors uppercase">CATÁLOGO</button>
            {!isLoggedIn ? (
              <button onClick={() => setCurrentView('login')} className="flex items-center gap-2 hover:text-white transition-colors uppercase">
                <User size={16} />
                LOGIN
              </button>
            ) : isAdmin ? (
              <>
                <button onClick={() => setCurrentView('admin')} className="flex items-center gap-2 text-[#ff6b00] hover:text-orange-400 transition-colors uppercase cursor-pointer">
                  <Shield size={16} />
                  PAINEL ADMIN
                </button>
                <button
                  onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setLoggedInEmail(''); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('isAdmin'); localStorage.removeItem('loggedInEmail'); setCurrentView('catalog'); }}
                  className="hover:text-white transition-colors"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setCurrentView('account')}
                  className="flex items-center gap-2 text-[#00e5ff] uppercase hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <User size={16} />
                  MINHA CONTA
                </button>
                <button
                  onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setLoggedInEmail(''); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('isAdmin'); localStorage.removeItem('loggedInEmail'); setCurrentView('catalog'); }}
                  className="hover:text-white transition-colors"
                  title="Sair"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentView('cart')}
              className="relative hover:text-white transition-colors"
            >
              <ShoppingCart size={16} />
              {cartTotalQty > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff6b00] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,107,0,0.5)]">
                  {cartTotalQty}
                </span>
              )}
            </button>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-grow">
          <button
            onClick={() => setCurrentView('catalog')}
            className="flex items-center gap-2 text-[#00e5ff] hover:text-cyan-300 font-black text-xs uppercase tracking-wider mb-8 transition-colors hover:-translate-x-1 duration-300"
          >
            &lt; VOLTAR
          </button>

          {embedVideoUrl && (
            <div className="w-full aspect-video rounded-lg overflow-hidden border border-[#00e5ff]/30 shadow-[0_0_30px_rgba(0,229,255,0.15)] mb-12 bg-black">
              <iframe
                src={embedVideoUrl}
                title={selectedGame.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-10">
            <div className="w-full md:w-1/3 shrink-0">
              <div className="bg-black border-2 border-gray-800 rounded-lg overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] sticky top-32">
                <img
                  src={selectedGame.image}
                  alt={selectedGame.title}
                  className="w-full h-auto aspect-[3/4] object-cover"
                />
              </div>
            </div>

            <div className="w-full md:w-2/3 flex flex-col pt-2">
              <div className="inline-block border border-[#ff6b00] text-[#ff6b00] text-[10px] font-black px-3 py-1 rounded w-fit mb-4 tracking-widest uppercase">
                {selectedGame.platform}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                {selectedGame.title}
              </h1>

              {selectedGame.description && (
                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 whitespace-pre-wrap flex-grow font-medium bg-[#111] p-6 rounded-lg border border-gray-800">
                  {selectedGame.description}
                </p>
              )}

              <div className="mt-auto border-t border-gray-800 pt-8">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">PREÇO</div>
                <div className="text-5xl font-black text-[#00ff44] mb-8 drop-shadow-[0_0_15px_rgba(0,255,68,0.2)]">
                  R$ {Number(selectedGame.price).toFixed(2)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleBuyClick(selectedGame)}
                    className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 px-6 rounded hover:bg-cyan-300 transition-colors tracking-widest text-sm flex justify-center items-center gap-3 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  >
                    <ShoppingCart size={20} strokeWidth={3} />
                    ADICIONAR AO CARRINHO
                  </button>
                  <button
                    onClick={() => handleBuyClick(selectedGame)}
                    className="w-full bg-[#00e5ff] text-black font-black uppercase py-4 px-6 rounded hover:bg-cyan-300 transition-colors tracking-widest text-sm shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                  >
                    IR PARA O CARRINHO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('catalog')}>
          <img
            src="/logo.png"
            alt="Games Nostálgicos"
            className="w-16 h-16 rounded-full border-4 border-[#ff6b00] shadow-[0_0_15px_rgba(255,107,0,0.5)] object-cover bg-white"
          />
        </div>
        <nav className="flex items-center gap-6 text-xs font-bold tracking-wider text-gray-400">
          <button onClick={() => setCurrentView('catalog')} className="hover:text-white transition-colors uppercase">CATÁLOGO</button>
          {!isLoggedIn ? (
            <button onClick={() => setCurrentView('login')} className="flex items-center gap-2 hover:text-white transition-colors uppercase">
              <User size={16} />
              LOGIN
            </button>
          ) : isAdmin ? (
            <>
              <button onClick={() => setCurrentView('admin')} className="flex items-center gap-2 text-[#ff6b00] hover:text-orange-400 transition-colors uppercase">
                <Shield size={16} />
                PAINEL ADMIN
              </button>
              <button
                onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setLoggedInEmail(''); localStorage.removeItem('isLoggedIn'); localStorage.removeItem('isAdmin'); localStorage.removeItem('loggedInEmail'); setCurrentView('catalog'); }}
                className="hover:text-white transition-colors"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setCurrentView('account')}
                className="flex items-center gap-2 text-[#00e5ff] uppercase hover:text-cyan-300 transition-colors cursor-pointer"
              >
                <User size={16} />
                MINHA CONTA
              </button>
              <button
                onClick={() => { setIsLoggedIn(false); setIsAdmin(false); setCurrentView('catalog'); }}
                className="hover:text-white transition-colors"
                title="Sair"
              >
                <LogOut size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => setCurrentView('cart')}
            className="relative hover:text-white transition-colors"
          >
            <ShoppingCart size={16} />
            {cartTotalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#ff6b00] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(255,107,0,0.5)]">
                {cartTotalQty}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-8">
          CATÁLOGO DE <span className="text-[#00e5ff]">JOGOS</span>
        </h1>

        {/* Search Bar */}
        <div className="flex w-full max-w-md mb-8">
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent border border-gray-700 border-r-0 rounded-l px-4 py-2 text-sm focus:outline-none focus:border-[#00e5ff] transition-colors placeholder-gray-600"
          />
          <button className="bg-[#00e5ff] text-black px-4 py-2 rounded-r flex items-center justify-center hover:bg-cyan-400 transition-colors">
            <Search size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <Filter size={20} className="text-gray-500 shrink-0" />
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-xs font-bold uppercase rounded whitespace-nowrap transition-colors ${activeFilter === filter
                ? 'bg-[#00e5ff] text-black'
                : 'border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGames.map(game => (
            <div key={game.id} className="flex flex-col bg-[#111] border border-gray-800 rounded-md overflow-hidden hover:border-gray-600 transition-colors group">
              {/* Image Container */}
              <div
                className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900 cursor-pointer"
                onClick={() => {
                  setSelectedGame(game);
                  setCurrentView('game');
                }}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Simulated PS2 Banner */}
                <div className="absolute top-0 left-0 right-0 bg-black/80 text-white text-[10px] font-bold px-2 py-1 flex justify-between items-center border-b border-gray-700">
                  <span>PlayStation 2</span>
                  <span className="text-blue-500">PS</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-sm font-bold text-white mb-4 line-clamp-2 leading-tight min-h-[2.5rem]">
                  {game.title}
                </h3>

                <div className="mt-auto flex justify-between items-end mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {game.platform}
                  </span>
                  <span className="text-lg font-black text-[#00ff44]">
                    R$ {game.price.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); handleBuyClick(game); }}
                  className="w-full bg-[#00e5ff] text-black text-xs font-black uppercase py-2.5 rounded hover:bg-cyan-400 transition-colors"
                >
                  COMPRAR
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            Nenhum jogo encontrado.
          </div>
        )}
      </main>

      {/* Universal Chat Modal Overlay */}
      {renderChatModal()}

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="flex items-center gap-4">
            <div className="text-[#00e5ff]">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="12" x2="10" y2="12"></line>
                <line x1="8" y1="10" x2="8" y2="14"></line>
                <line x1="15" y1="13" x2="15.01" y2="13"></line>
                <line x1="18" y1="11" x2="18.01" y2="11"></line>
                <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white m-0 leading-tight">GAMES NOSTÁLGICOS</h2>
              <p className="text-gray-500 text-sm font-mono mt-1">Reviva os clássicos</p>
            </div>
          </div>
          <div className="text-center md:text-right text-gray-500 text-sm font-mono flex flex-col gap-2">
            <p>© 2026 Games Nostálgicos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
