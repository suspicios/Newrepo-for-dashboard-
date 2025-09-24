import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Home, Smartphone, CreditCard, User, Upload, CheckCircle, Clock, DollarSign, Users, Wallet, Menu, X, Plus, Settings, Sun, Moon, Play, Pause, ArrowRight, ExternalLink, Copy, Check, Building, PiggyBank, Briefcase, Link2, Unlink, Download, Upload as UploadIcon } from 'lucide-react';

const XPayDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showACAdder, setShowACAdder] = useState(false);
  const [showBulkACAdder, setShowBulkACAdder] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [showClientLinking, setShowClientLinking] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Default to light mode
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAC, setSelectedAC] = useState(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [txHash, setTxHash] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [copied, setCopied] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState('');
  const [bulkAccounts, setBulkAccounts] = useState('');
  const [withdrawalData, setWithdrawalData] = useState({
    amount: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    holderName: '',
    usdtAddress: ''
  });
  
  const [accountType, setAccountType] = useState('');
  const [newAC, setNewAC] = useState({
    accountType: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
    holderName: '',
    // Corporate specific fields
    userId: '',
    corporateId: '',
    loginId: '',
    loginPassword: '',
    transactionPassword: '',
    // Savings/Current fields
    netbankingId: '',
    netbankingPassword: ''
  });
  
  const [settings, setSettings] = useState({
    withdrawalEnabled: true,
    autoVerification: false,
    notificationsEnabled: true
  });

  // Add withdrawal requests state
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);

  useEffect(() => {
    let interval;
    if (paymentSubmitted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setVerificationStatus('expired');
    }
    return () => clearInterval(interval);
  }, [paymentSubmitted, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const theme = {
    bg: darkMode ? 'from-gray-900 via-black to-gray-800' : 'from-blue-50 via-white to-blue-50',
    cardBg: darkMode ? 'bg-gray-800/50' : 'bg-white/90',
    sidebarBg: darkMode ? 'from-gray-900 to-black' : 'from-blue-800 to-purple-800',
    text: darkMode ? 'text-white' : 'text-gray-800',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-300',
    inputBg: darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-white border-gray-300'
  };
  
  const [credentials, setCredentials] = useState([
    { 
      id: 1, 
      bankName: 'HDFC Bank', 
      accountNumber: '1234****5678', 
      ifsc: 'HDFC0001234',
      holderName: 'John Doe',
      accountType: 'savings',
      status: 'verified', 
      commission: 150,
      assignedClient: 'Client 1',
      isRunning: true
    },
    { 
      id: 2, 
      bankName: 'SBI', 
      accountNumber: '9876****3210', 
      ifsc: 'SBIN0005678',
      holderName: 'Jane Smith',
      accountType: 'current',
      status: 'queue', 
      commission: 0,
      assignedClient: null,
      isRunning: false
    },
    { 
      id: 3, 
      bankName: 'ICICI Bank', 
      accountNumber: '5555****1111', 
      ifsc: 'ICIC0001234',
      holderName: 'Corporate User',
      accountType: 'corporate',
      status: 'queue', 
      commission: 0,
      assignedClient: null,
      isRunning: false
    }
  ]);
  
  const [clients, setClients] = useState([
    { id: 'Client 1', name: 'Client 1', status: 'connected', lastActive: '5 mins ago', assignedAC: 1 },
    { id: 'Client 2', name: 'Client 2', status: 'connected', lastActive: '10 mins ago', assignedAC: null },
    { id: 'Client 3', name: 'Client 3', status: 'disconnected', lastActive: '1 hour ago', assignedAC: null }
  ]);
  
  const [withdrawalHistory] = useState([
    { id: 1, amount: 500, method: 'Bank Transfer', status: 'completed', date: '2024-01-15', bankName: 'HDFC Bank' },
    { id: 2, amount: 250, method: 'USDT', status: 'pending', date: '2024-01-14', address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE' },
    { id: 3, amount: 1000, method: 'Bank Transfer', status: 'completed', date: '2024-01-10', bankName: 'SBI' }
  ]);
  
  const [dashboardStats] = useState({
    totalWork: 47,
    totalCommission: 2850,
    connectedClients: 23,
    pendingWithdrawals: 5,
    ongoingWork: 3
  });

  const walletAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";

  const handleLogin = () => {
    if (loginData.email === 'admin@xpay.com' && loginData.password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleAddAC = () => {
    const requiredFields = ['bankName', 'accountNumber', 'ifsc', 'holderName', 'accountType'];
    const corporateFields = ['userId', 'corporateId', 'loginId', 'loginPassword', 'transactionPassword'];
    const netbankingFields = ['netbankingId', 'netbankingPassword'];
    
    // Check basic required fields
    const missingBasicFields = requiredFields.some(field => !newAC[field]);
    
    // Check corporate specific fields if account type is corporate
    const missingCorporateFields = newAC.accountType === 'corporate' && 
      corporateFields.some(field => !newAC[field]);
    
    // Check netbanking fields for savings/current accounts
    const missingNetbankingFields = (newAC.accountType === 'savings' || newAC.accountType === 'current') && 
      netbankingFields.some(field => !newAC[field]);
    
    if (missingBasicFields || missingCorporateFields || missingNetbankingFields) {
      alert('Please fill all required fields');
      return;
    }
    
    const newId = Math.max(...credentials.map(c => c.id)) + 1;
    const maskedAccount = newAC.accountNumber.slice(0, 4) + '****' + newAC.accountNumber.slice(-4);
    
    setCredentials(prev => [...prev, {
      id: newId,
      bankName: newAC.bankName,
      accountNumber: maskedAccount,
      ifsc: newAC.ifsc,
      holderName: newAC.holderName,
      accountType: newAC.accountType,
      status: 'queue',
      commission: 0,
      assignedClient: null,
      isRunning: false,
      // Store corporate details (in real app, these would be encrypted)
      ...(newAC.accountType === 'corporate' && {
        corporateDetails: {
          userId: newAC.userId,
          corporateId: newAC.corporateId,
          loginId: newAC.loginId
        }
      }),
      // Store netbanking details for savings/current
      ...((newAC.accountType === 'savings' || newAC.accountType === 'current') && {
        netbankingDetails: {
          netbankingId: newAC.netbankingId,
          netbankingPassword: newAC.netbankingPassword
        }
      })
    }]);
    
    setNewAC({
      accountType: '',
      bankName: '',
      accountNumber: '',
      ifsc: '',
      holderName: '',
      userId: '',
      corporateId: '',
      loginId: '',
      loginPassword: '',
      transactionPassword: '',
      netbankingId: '',
      netbankingPassword: ''
    });
    setShowACAdder(false);
  };

  const handleBulkAddAC = () => {
    if (!bulkAccounts.trim()) {
      alert('Please enter account details');
      return;
    }
    
    const accounts = bulkAccounts.split('\n').filter(line => line.trim());
    let addedCount = 0;
    
    accounts.forEach(accountLine => {
      const parts = accountLine.split(',');
      if (parts.length >= 5) {
        const [accountType, bankName, accountNumber, ifsc, holderName] = parts.map(p => p.trim());
        
        if (accountType && bankName && accountNumber && ifsc && holderName) {
          const newId = Math.max(...credentials.map(c => c.id), 0) + 1;
          const maskedAccount = accountNumber.slice(0, 4) + '****' + accountNumber.slice(-4);
          
          setCredentials(prev => [...prev, {
            id: newId,
            bankName,
            accountNumber: maskedAccount,
            ifsc,
            holderName,
            accountType: accountType.toLowerCase(),
            status: 'queue',
            commission: 0,
            assignedClient: null,
            isRunning: false
          }]);
          
          addedCount++;
        }
      }
    });
    
    alert(`Successfully added ${addedCount} accounts to queue`);
    setBulkAccounts('');
    setShowBulkACAdder(false);
  };

  const handleMarkAsVerified = (credId) => {
    setCredentials(prev => prev.map(cred => 
      cred.id === credId ? { ...cred, status: 'verified' } : cred
    ));
  };

  const handleLinkClient = (clientId, acId) => {
    // Update credentials
    setCredentials(prev => prev.map(cred => ({
      ...cred,
      assignedClient: cred.id === acId ? clientId : 
        (cred.assignedClient === clientId ? null : cred.assignedClient)
    })));
    
    // Update clients
    setClients(prev => prev.map(client => ({
      ...client,
      assignedAC: client.id === clientId ? acId : 
        (client.assignedAC === acId ? null : client.assignedAC)
    })));
    
    setShowClientLinking(false);
  };

  const handleUnlinkClient = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (client && client.assignedAC) {
      setCredentials(prev => prev.map(cred => 
        cred.id === client.assignedAC ? { ...cred, assignedClient: null } : cred
      ));
      setClients(prev => prev.map(c => 
        c.id === clientId ? { ...c, assignedAC: null } : c
      ));
    }
  };

  const handleWithdrawalRequest = () => {
    if (!withdrawalData.amount || !withdrawalMethod) {
      alert('Please fill all required fields');
      return;
    }

    const newRequest = {
      id: withdrawalRequests.length + 1,
      amount: parseFloat(withdrawalData.amount),
      method: withdrawalMethod === 'bank' ? 'Bank Transfer' : 'USDT',
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      ...(withdrawalMethod === 'bank' ? {
        bankName: withdrawalData.bankName,
        accountNumber: withdrawalData.accountNumber
      } : {
        address: withdrawalData.usdtAddress
      })
    };

    setWithdrawalRequests(prev => [...prev, newRequest]);
    setShowWithdrawal(false);
    setWithdrawalData({
      amount: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      holderName: '',
      usdtAddress: ''
    });
    setWithdrawalMethod('');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'savings': return <PiggyBank size={16} className="text-green-400" />;
      case 'current': return <Building size={16} className="text-blue-400" />;
      case 'corporate': return <Briefcase size={16} className="text-purple-400" />;
      default: return <Wallet size={16} className="text-gray-400" />;
    }
  };

  const getAccountTypeBadge = (type) => {
    const colors = {
      savings: 'bg-green-500/20 text-green-400',
      current: 'bg-blue-500/20 text-blue-400',
      corporate: 'bg-purple-500/20 text-purple-400'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  // Calculate ongoing work
  const ongoingWork = credentials.filter(cred => cred.isRunning).length;

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4`}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
              XPay
            </h1>
            <p className={theme.textSecondary}>Login to your dashboard</p>
          </div>
          
          <div className={`${theme.cardBg} backdrop-blur-sm p-6 sm:p-8 rounded-2xl ${theme.border} border`}>
            <div className="mb-6">
              <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                placeholder="Enter your email"
              />
            </div>
            
            <div className="mb-6">
              <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors pr-12`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-3 ${theme.textSecondary} hover:${theme.text} transition-colors`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105"
            >
              Login
            </button>
            
            <div className="mt-4 text-center">
              <p className={`text-xs ${theme.textSecondary}`}>Demo: admin@xpay.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} ${darkMode ? 'text-white' : 'text-gray-800'}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b ${theme.sidebarBg} ${theme.border} border-r transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className={`flex items-center justify-between h-16 px-4 ${theme.border} border-b`}>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            XPay
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4">
          <div className="space-y-2">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'clients', label: 'Clients', icon: Smartphone },
              { id: 'withdrawal', label: 'Withdrawal', icon: CreditCard },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {setCurrentPage(item.id); setSidebarOpen(false);}}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  currentPage === item.id
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-l-4 border-blue-500'
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <div className={`sticky top-0 z-40 ${theme.cardBg} backdrop-blur-sm ${theme.border} border-b px-4 py-4`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden ${theme.textSecondary} hover:${theme.text}`}
            >
              <Menu size={24} />
            </button>
            
            <h1 className={`text-xl font-bold ${theme.text} lg:block hidden`}>
              {currentPage === 'home' && 'Dashboard'}
              {currentPage === 'clients' && 'Client Management'}
              {currentPage === 'withdrawal' && 'Withdrawal'}
              {currentPage === 'profile' && 'Profile'}
            </h1>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded-lg transition-colors ${theme.textSecondary} hover:${theme.text}`}
              >
                <Settings size={20} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  XP
                </div>
                <span className={`${theme.text} font-medium hidden sm:block`}>Admin</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-4 sm:p-6">
          {currentPage === 'home' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-4 sm:p-6 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <DollarSign className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <p className={`${theme.textSecondary} text-sm`}>Total Commission</p>
                      <p className={`text-xl sm:text-2xl font-bold ${theme.text}`}>${dashboardStats.totalCommission}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 p-4 sm:p-6 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <CheckCircle className="text-green-400" size={24} />
                    </div>
                    <div>
                      <p className={`${theme.textSecondary} text-sm`}>Work Completed</p>
                      <p className={`text-xl sm:text-2xl font-bold ${theme.text}`}>{dashboardStats.totalWork}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 p-4 sm:p-6 rounded-xl border border-purple-500/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/20 rounded-lg">
                      <Users className="text-purple-400" size={24} />
                    </div>
                    <div>
                      <p className={`${theme.textSecondary} text-sm`}>Connected Clients</p>
                      <p className={`text-xl sm:text-2xl font-bold ${theme.text}`}>{dashboardStats.connectedClients}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4 sm:p-6 rounded-xl border border-orange-500/20">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-lg">
                      <Play className="text-orange-400" size={24} />
                    </div>
                    <div>
                      <p className={`${theme.textSecondary} text-sm`}>Ongoing Work</p>
                      <p className={`text-xl sm:text-2xl font-bold ${theme.text}`}>{ongoingWork}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${theme.cardBg} p-4 sm:p-6 rounded-xl ${theme.border} border`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <h3 className={`text-lg font-semibold ${theme.text}`}>Account Management</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBulkACAdder(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                      <UploadIcon size={16} />
                      Bulk Add
                    </button>
                    <button
                      onClick={() => setShowACAdder(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                    >
                      <Plus size={16} />
                      Add Account
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  {credentials.map((cred) => (
                    <div key={cred.id} className={`flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg gap-3`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {getAccountTypeIcon(cred.accountType)}
                          <p className={`${theme.text} font-medium`}>{cred.bankName}</p>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getAccountTypeBadge(cred.accountType)}`}>
                            {cred.accountType}
                          </span>
                          {cred.isRunning && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium flex items-center gap-1">
                              <Play size={12} />
                              Running
                            </span>
                          )}
                        </div>
                        <p className={`${theme.textSecondary} text-sm mb-1`}>{cred.accountNumber}</p>
                        <p className={`${theme.textSecondary} text-xs`}>{cred.holderName}</p>
                        {cred.assignedClient && (
                          <p className="text-blue-400 text-xs mt-1">Assigned to: {cred.assignedClient}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          cred.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                          cred.status === 'queue' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {cred.status}
                        </span>
                        {cred.status === 'queue' && (
                          <button
                            onClick={() => handleMarkAsVerified(cred.id)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors"
                          >
                            Mark Verified
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentPage === 'clients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${theme.text}`}>Client Management</h2>
                <button
                  onClick={() => setShowClientLinking(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  <Link2 size={16} />
                  Link Accounts
                </button>
              </div>
              
              <div className={`${theme.cardBg} p-4 sm:p-6 rounded-xl ${theme.border} border`}>
                <div className="space-y-4">
                  {clients.map((client) => {
                    const linkedAC = credentials.find(ac => ac.id === client.assignedAC);
                    return (
                      <div key={client.id} className={`p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg`}>
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className={`font-medium ${theme.text}`}>{client.name}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                client.status === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                              }`}>
                                {client.status}
                              </span>
                              {linkedAC && (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium flex items-center gap-1">
                                  <Link2 size={12} />
                                  {linkedAC.bankName}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${theme.textSecondary}`}>Last active: {client.lastActive}</p>
                            {linkedAC && (
                              <div className="mt-2">
                                <p className={`text-xs ${theme.textSecondary}`}>
                                  Linked Account: {linkedAC.accountNumber} ({linkedAC.accountType})
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {client.assignedAC && (
                              <button
                                onClick={() => handleUnlinkClient(client.id)}
                                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all flex items-center gap-1"
                              >
                                <Unlink size={14} />
                                Unlink
                              </button>
                            )}
                            <button
                              onClick={() => setShowCheckout(true)}
                              className="px-3 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white rounded-lg text-sm transition-all"
                            >
                              Activate
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentPage === 'withdrawal' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${theme.text}`}>Withdrawal Management</h2>
                <button
                  onClick={() => setShowWithdrawal(true)}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  Request Withdrawal
                </button>
              </div>
              
              {/* Withdrawal Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${theme.cardBg} p-6 rounded-xl ${theme.border} border`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-500/20 rounded-lg">
                      <CheckCircle className="text-green-400" size={24} />
                    </div>
                    <div>
                      <p className={`${theme.textSecondary} text-sm`}>Total Withdrawn</p>
                      <p className={`text-2xl font-bold ${theme.text}`}>$1,750</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${theme.cardBg} p-6 rounded-xl ${theme.border} border`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-500/20 rounded-lg">
                      <Clock className="text-yellow-400" size={24} />
                    </div>
                    <div>
                      <p className={`${theme.textSecondary} text-sm`}>Pending Requests</p>
                      <p className={`text-2xl font-bold ${theme.text}`}>{withdrawalRequests.length}</p>
                    </div>
                  </div>
                </div>
                
                <div className={`${theme.cardBg} p-6 rounded-xl ${theme.border} border`}>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <Wallet className="text-blue-400" size={24} />
                    </div>
                    <div>
                      <p className={`${theme.textSecondary} text-sm`}>Available Balance</p>
                      <p className={`text-2xl font-bold ${theme.text}`}>$850</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Withdrawal Requests */}
              {withdrawalRequests.length > 0 && (
                <div className={`${theme.cardBg} p-4 sm:p-6 rounded-xl ${theme.border} border`}>
                  <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Pending Withdrawal Requests</h3>
                  <div className="space-y-3">
                    {withdrawalRequests.map((request) => (
                      <div key={request.id} className={`p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg`}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className={`font-medium ${theme.text}`}>${request.amount}</p>
                              <span className={`px-2 py-1 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400`}>
                                {request.status}
                              </span>
                            </div>
                            <p className={`text-sm ${theme.textSecondary}`}>
                              {request.method} • {request.date}
                            </p>
                            {request.bankName && (
                              <p className={`text-xs ${theme.textSecondary}`}>Bank: {request.bankName} ({request.accountNumber})</p>
                            )}
                            {request.address && (
                              <p className={`text-xs ${theme.textSecondary}`}>Address: {request.address.slice(0, 20)}...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Withdrawal History */}
              <div className={`${theme.cardBg} p-4 sm:p-6 rounded-xl ${theme.border} border`}>
                <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Withdrawal History</h3>
                <div className="space-y-3">
                  {withdrawalHistory.map((withdrawal) => (
                    <div key={withdrawal.id} className={`p-4 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} rounded-lg`}>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className={`font-medium ${theme.text}`}>${withdrawal.amount}</p>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              withdrawal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              withdrawal.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {withdrawal.status}
                            </span>
                          </div>
                          <p className={`text-sm ${theme.textSecondary}`}>
                            {withdrawal.method} • {withdrawal.date}
                          </p>
                          {withdrawal.bankName && (
                            <p className={`text-xs ${theme.textSecondary}`}>Bank: {withdrawal.bankName}</p>
                          )}
                          {withdrawal.address && (
                            <p className={`text-xs ${theme.textSecondary}`}>Address: {withdrawal.address.slice(0, 20)}...</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentPage === 'profile' && (
            <div className="space-y-6">
              <div className={`${theme.cardBg} p-4 sm:p-6 rounded-xl ${theme.border} border`}>
                <h2 className={`text-2xl font-bold ${theme.text} mb-6`}>Profile Settings</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Account Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Email</label>
                        <input
                          type="email"
                          value="admin@xpay.com"
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          readOnly
                        />
                      </div>
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>User ID</label>
                        <input
                          type="text"
                          value="XP_ADMIN_001"
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Security</h3>
                    <div className="space-y-4">
                      <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all">
                        Change Password
                      </button>
                      <button className="w-full p-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg transition-all">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showACAdder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl ${theme.cardBg} rounded-2xl ${theme.border} border max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Add New Account</h3>
                <button onClick={() => setShowACAdder(false)} className={`${theme.textSecondary} hover:${theme.text}`}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Account Type *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['savings', 'current', 'corporate'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setNewAC({...newAC, accountType: type});
                          setAccountType(type);
                        }}
                        className={`p-3 rounded-lg border transition-all ${
                          newAC.accountType === type
                            ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                            : `${theme.border} ${theme.inputBg} ${theme.text} hover:border-blue-500`
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Bank Name *</label>
                    <input
                      type="text"
                      value={newAC.bankName}
                      onChange={(e) => setNewAC({...newAC, bankName: e.target.value})}
                      className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Enter bank name"
                    />
                  </div>
                  <div>
                    <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Account Number *</label>
                    <input
                      type="text"
                      value={newAC.accountNumber}
                      onChange={(e) => setNewAC({...newAC, accountNumber: e.target.value})}
                      className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>IFSC Code *</label>
                    <input
                      type="text"
                      value={newAC.ifsc}
                      onChange={(e) => setNewAC({...newAC, ifsc: e.target.value})}
                      className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Enter IFSC code"
                    />
                  </div>
                  <div>
                    <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Holder Name *</label>
                    <input
                      type="text"
                      value={newAC.holderName}
                      onChange={(e) => setNewAC({...newAC, holderName: e.target.value})}
                      className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Enter holder name"
                    />
                  </div>
                </div>

                {/* Corporate Account Fields */}
                {newAC.accountType === 'corporate' && (
                  <div className="space-y-4 p-4 bg-blue-500/10 rounded-lg">
                    <h4 className={`font-medium ${theme.text}`}>Corporate Account Credentials</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>User ID *</label>
                        <input
                          type="text"
                          value={newAC.userId}
                          onChange={(e) => setNewAC({...newAC, userId: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Enter user ID"
                        />
                      </div>
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Corporate ID *</label>
                        <input
                          type="text"
                          value={newAC.corporateId}
                          onChange={(e) => setNewAC({...newAC, corporateId: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Enter corporate ID"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Login ID *</label>
                        <input
                          type="text"
                          value={newAC.loginId}
                          onChange={(e) => setNewAC({...newAC, loginId: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Enter login ID"
                        />
                      </div>
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Login Password *</label>
                        <input
                          type="password"
                          value={newAC.loginPassword}
                          onChange={(e) => setNewAC({...newAC, loginPassword: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Enter login password"
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Transaction Password *</label>
                      <input
                        type="password"
                        value={newAC.transactionPassword}
                        onChange={(e) => setNewAC({...newAC, transactionPassword: e.target.value})}
                        className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                        placeholder="Enter transaction password"
                      />
                    </div>
                  </div>
                )}

                {/* Savings/Current Account Fields */}
                {(newAC.accountType === 'savings' || newAC.accountType === 'current') && (
                  <div className="space-y-4 p-4 bg-green-500/10 rounded-lg">
                    <h4 className={`font-medium ${theme.text}`}>Net Banking Credentials</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Net Banking ID *</label>
                        <input
                          type="text"
                          value={newAC.netbankingId}
                          onChange={(e) => setNewAC({...newAC, netbankingId: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Enter net banking ID"
                        />
                      </div>
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Net Banking Password *</label>
                        <input
                          type="password"
                          value={newAC.netbankingPassword}
                          onChange={(e) => setNewAC({...newAC, netbankingPassword: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Enter net banking password"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddAC}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                  >
                    Add Account
                  </button>
                  <button
                    onClick={() => setShowACAdder(false)}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Account Adder Modal */}
      {showBulkACAdder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl ${theme.cardBg} rounded-2xl ${theme.border} border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Bulk Add Accounts</h3>
                <button onClick={() => setShowBulkACAdder(false)} className={`${theme.textSecondary} hover:${theme.text}`}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>
                    Enter account details (one per line, comma-separated):
                  </label>
                  <p className={`text-xs ${theme.textSecondary} mb-2`}>
                    Format: accountType,bankName,accountNumber,ifscCode,holderName
                  </p>
                  <textarea
                    value={bulkAccounts}
                    onChange={(e) => setBulkAccounts(e.target.value)}
                    rows={8}
                    className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="savings,HDFC Bank,1234567890,HDFC0001234,John Doe&#10;current,SBI,9876543210,SBIN0005678,Jane Smith&#10;corporate,ICICI Bank,5555111122,ICIC0001234,Corporate User"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleBulkAddAC}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                  >
                    Add Accounts
                  </button>
                  <button
                    onClick={() => setShowBulkACAdder(false)}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Request Modal */}
      {showWithdrawal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md ${theme.cardBg} rounded-2xl ${theme.border} border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Request Withdrawal</h3>
                <button onClick={() => setShowWithdrawal(false)} className={`${theme.textSecondary} hover:${theme.text}`}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Withdrawal Method *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setWithdrawalMethod('bank')}
                      className={`p-3 rounded-lg border transition-all ${
                        withdrawalMethod === 'bank'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                          : `${theme.border} ${theme.inputBg} ${theme.text} hover:border-blue-500`
                      }`}
                    >
                      Bank Transfer
                    </button>
                    <button
                      onClick={() => setWithdrawalMethod('usdt')}
                      className={`p-3 rounded-lg border transition-all ${
                        withdrawalMethod === 'usdt'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500'
                          : `${theme.border} ${theme.inputBg} ${theme.text} hover:border-blue-500`
                      }`}
                    >
                      USDT
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Amount ($) *</label>
                  <input
                    type="number"
                    value={withdrawalData.amount}
                    onChange={(e) => setWithdrawalData({...withdrawalData, amount: e.target.value})}
                    className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="Enter amount"
                  />
                </div>
                
                {withdrawalMethod === 'bank' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Bank Name</label>
                        <input
                          type="text"
                          value={withdrawalData.bankName}
                          onChange={(e) => setWithdrawalData({...withdrawalData, bankName: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Bank name"
                        />
                      </div>
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Account Number</label>
                        <input
                          type="text"
                          value={withdrawalData.accountNumber}
                          onChange={(e) => setWithdrawalData({...withdrawalData, accountNumber: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Account number"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>IFSC Code</label>
                        <input
                          type="text"
                          value={withdrawalData.ifscCode}
                          onChange={(e) => setWithdrawalData({...withdrawalData, ifscCode: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="IFSC code"
                        />
                      </div>
                      <div>
                        <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>Holder Name</label>
                        <input
                          type="text"
                          value={withdrawalData.holderName}
                          onChange={(e) => setWithdrawalData({...withdrawalData, holderName: e.target.value})}
                          className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                          placeholder="Holder name"
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {withdrawalMethod === 'usdt' && (
                  <div>
                    <label className={`block ${theme.textSecondary} text-sm font-medium mb-2`}>USDT Address</label>
                    <input
                      type="text"
                      value={withdrawalData.usdtAddress}
                      onChange={(e) => setWithdrawalData({...withdrawalData, usdtAddress: e.target.value})}
                      className={`w-full p-3 ${theme.inputBg} ${theme.text} rounded-lg focus:outline-none focus:border-blue-500 transition-colors`}
                      placeholder="Enter USDT address"
                    />
                  </div>
                )}
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleWithdrawalRequest}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                  >
                    Request Withdrawal
                  </button>
                  <button
                    onClick={() => setShowWithdrawal(false)}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md ${theme.cardBg} rounded-2xl ${theme.border} border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Settings</h3>
                <button onClick={() => setShowSettings(false)} className={`${theme.textSecondary} hover:${theme.text}`}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${theme.text}`}>Dark Mode</p>
                    <p className={`text-sm ${theme.textSecondary}`}>Toggle dark/light theme</p>
                  </div>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      darkMode ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      darkMode ? 'transform translate-x-7' : 'transform translate-x-1'
                    }`} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${theme.text}`}>Withdrawal Enabled</p>
                      <p className={`text-sm ${theme.textSecondary}`}>Allow withdrawal requests</p>
                    </div>
                    <button
                      onClick={() => setSettings({...settings, withdrawalEnabled: !settings.withdrawalEnabled})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        settings.withdrawalEnabled ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.withdrawalEnabled ? 'transform translate-x-7' : 'transform translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${theme.text}`}>Auto Verification</p>
                      <p className={`text-sm ${theme.textSecondary}`}>Automatically verify new accounts</p>
                    </div>
                    <button
                      onClick={() => setSettings({...settings, autoVerification: !settings.autoVerification})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        settings.autoVerification ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.autoVerification ? 'transform translate-x-7' : 'transform translate-x-1'
                      }`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${theme.text}`}>Notifications</p>
                      <p className={`text-sm ${theme.textSecondary}`}>Enable push notifications</p>
                    </div>
                    <button
                      onClick={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        settings.notificationsEnabled ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        settings.notificationsEnabled ? 'transform translate-x-7' : 'transform translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Client Modal */}
      {showClientLinking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-2xl ${theme.cardBg} rounded-2xl ${theme.border} border`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Link Account to Client</h3>
                <button onClick={() => setShowClientLinking(false)} className={`${theme.textSecondary} hover:${theme.text}`}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className={`block ${theme.textSecondary} text-sm font-medium mb-3`}>Select Client</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {clients.map((client) => (
                      <button
                        key={client.id}
                        onClick={() => setSelectedClient(client.id)}
                        className={`p-4 rounded-lg border text-left transition-all ${
                          selectedClient === client.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : `${theme.border} ${theme.inputBg} hover:border-blue-500`
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            client.status === 'connected' ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                          <span className={`font-medium ${theme.text}`}>{client.name}</span>
                        </div>
                        <p className={`text-sm ${theme.textSecondary} mt-1`}>{client.status} • {client.lastActive}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block ${theme.textSecondary} text-sm font-medium mb-3`}>Select Account</label>
                  <div className="space-y-3">
                    {credentials.filter(cred => cred.status === 'verified').map((cred) => (
                      <button
                        key={cred.id}
                        onClick={() => setSelectedAC(cred.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          selectedAC === cred.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : `${theme.border} ${theme.inputBg} hover:border-blue-500`
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              {getAccountTypeIcon(cred.accountType)}
                              <span className={`font-medium ${theme.text}`}>{cred.bankName}</span>
                              <span className={`px-2 py-1 rounded text-xs ${getAccountTypeBadge(cred.accountType)}`}>
                                {cred.accountType}
                              </span>
                            </div>
                            <p className={`text-sm ${theme.textSecondary}`}>{cred.accountNumber}</p>
                          </div>
                          {cred.assignedClient && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                              Linked
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleLinkClient(selectedClient, selectedAC)}
                    disabled={!selectedClient || !selectedAC}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-all"
                  >
                    Link Account
                  </button>
                  <button
                    onClick={() => setShowClientLinking(false)}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XPayDashboard;
