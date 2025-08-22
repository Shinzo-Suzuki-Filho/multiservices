// Main Application Logic for MultiServices

// Data Storage
class DataStorage {
    constructor() {
        this.providersKey = 'multiservices_providers';
        this.clientsKey = 'multiservices_clients';
        this.reviewsKey = 'multiservices_reviews';
    }

    // Provider Methods
    getProviders() {
        return JSON.parse(localStorage.getItem(this.providersKey)) || [];
    }

    saveProvider(provider) {
        const providers = this.getProviders();
        provider.id = Date.now().toString();
        providers.push(provider);
        localStorage.setItem(this.providersKey, JSON.stringify(providers));
        return provider;
    }

    getProviderById(id) {
        const providers = this.getProviders();
        return providers.find(p => p.id === id);
    }

    // Client Methods
    getClients() {
        return JSON.parse(localStorage.getItem(this.clientsKey)) || [];
    }

    saveClient(client) {
        const clients = this.getClients();
        client.id = Date.now().toString();
        clients.push(client);
        localStorage.setItem(this.clientsKey, JSON.stringify(clients));
        return client;
    }

    // Review Methods
    getReviews(providerId) {
        const reviews = JSON.parse(localStorage.getItem(this.reviewsKey)) || [];
        return reviews.filter(r => r.providerId === providerId);
    }

    saveReview(review) {
        const reviews = JSON.parse(localStorage.getItem(this.reviewsKey)) || [];
        review.id = Date.now().toString();
        review.date = new Date().toISOString();
        reviews.push(review);
        localStorage.setItem(this.reviewsKey, JSON.stringify(reviews));
        return review;
    }

    getAverageRating(providerId) {
        const reviews = this.getReviews(providerId);
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    }
}

// Form Validation
class FormValidator {
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
        return phoneRegex.test(phone);
    }

    static validateRequired(value) {
        return value && value.trim().length > 0;
    }

    static validateRating(rating) {
        return rating >= 1 && rating <= 5;
    }
}

// Utility Functions
const Utils = {
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    },

    formatDate: (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    },

    generateStars: (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="fas fa-star"></i>);
        }

        if (hasHalfStar) {
            stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
        }

        return stars;
    }
};

// Provider Registration Form Component
const ProviderRegistrationForm = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        experience: '',
        description: '',
        location: '',
        hourlyRate: ''
    });

    const [errors, setErrors] = React.useState({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!FormValidator.validateRequired(formData.name)) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!FormValidator.validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!FormValidator.validatePhone(formData.phone)) {
            newErrors.phone = 'Telefone inválido';
        }

        if (!FormValidator.validateRequired(formData.service)) {
            newErrors.service = 'Serviço é obrigatório';
        }

        if (!FormValidator.validateRequired(formData.location)) {
            newErrors.location = 'Localização é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            
            // Simulate API call
            setTimeout(() => {
                const storage = new DataStorage();
                storage.saveProvider(formData);
                
                setIsSubmitting(false);
                setSubmitSuccess(true);
                
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    service: '',
                    experience: '',
                    description: '',
                    location: '',
                    hourlyRate: ''
                });
                
                // Hide success message after 3 seconds
                setTimeout(() => setSubmitSuccess(false), 3000);
            }, 1000);
        }
    };

    const serviceOptions = [
        'Pintor',
        'Encanador',
        'Instalador de Ar Condicionado',
        'Eletricista',
        'Pedreiro',
        'Jardineiro',
        'Outro'
    ];

    return (
        <div className="form-container">
            <h2 className="section-title">Cadastro de Prestador</h2>
            
            {submitSuccess && (
                <div style={{
                    background: 'var(--success-color)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '5px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    <i className="fas fa-check-circle"></i> Cadastro realizado com sucesso!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Seu nome completo"
                    />
                    {errors.name && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="seu@email.com"
                    />
                    {errors.email && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Telefone *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="(11) 99999-9999"
                    />
                    {errors.phone && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Serviço *</label>
                    <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="">Selecione o serviço</option>
                        {serviceOptions.map(service => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </select>
                    {errors.service && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.service}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Experiência</label>
                    <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Ex: 5 anos de experiência"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Localização *</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Cidade - Estado"
                    />
                    {errors.location && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.location}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Descrição dos Serviços</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="form-textarea"
                        placeholder="Descreva os serviços que você oferece..."
                        rows="4"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Taxa por Hora (opcional)</label>
                    <input
                        type="number"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="R$ 0,00"
                        min="0"
                        step="0.01"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ width: '100%' }}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading"></span> Cadastrando...
                        </>
                    ) : (
                        'Cadastrar como Prestador'
                    )}
                </button>
            </form>
        </div>
    );
};

// Initialize sample data if empty
const initializeSampleData = () => {
    const storage = new DataStorage();
    
    if (storage.getProviders().length === 0) {
        const sampleProviders = [
            {
                name: 'Carlos Silva',
                email: 'carlos@pintor.com',
                phone: '(11) 99999-9999',
                service: 'Pintor',
                experience: '8 anos de experiência',
                description: 'Pintura residencial e comercial, trabalhos com textura e efeitos especiais.',
                location: 'São Paulo - SP',
                hourlyRate: '80.00'
            },
            {
                name: 'Maria Santos',
                email: 'maria@encanadora.com',
                phone: '(11) 98888-8888',
                service: 'Encanadora',
                experience: '6 anos de experiência',
                description: 'Instalação e reparo hidráulico, desentupimento e manutenção preventiva.',
                location: 'São Paulo - SP',
                hourlyRate: '70.00'
            },
            {
                name: 'João Pereira',
                email: 'joao@arcondicionado.com',
                phone: '(11) 97777-7777',
                service: 'Instalador de Ar Condicionado',
                experience: '10 anos de experiência',
                description: 'Instalação e manutenção de ar condicionado split, central e janela.',
                location: 'São Paulo - SP',
                hourlyRate: '120.00'
            }
        ];

        sampleProviders.forEach(provider => storage.saveProvider(provider));
    }
};

// Provider Listing Component
const ProviderListing = () => {
    const [providers, setProviders] = React.useState([]);
    const [filteredProviders, setFilteredProviders] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedService, setSelectedService] = React.useState('');

    React.useEffect(() => {
        const storage = new DataStorage();
        const allProviders = storage.getProviders();
        setProviders(allProviders);
        setFilteredProviders(allProviders);
    }, []);

    React.useEffect(() => {
        let filtered = providers;
        
        if (searchTerm) {
            filtered = filtered.filter(provider =>
                provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        if (selectedService) {
            filtered = filtered.filter(provider =>
                provider.service === selectedService
            );
        }
        
        setFilteredProviders(filtered);
    }, [searchTerm, selectedService, providers]);

    const serviceOptions = [
        'Todos',
        'Pintor',
        'Encanador',
        'Instalador de Ar Condicionado',
        'Eletricista',
        'Pedreiro',
        'Jardineiro'
    ];

    return (
        <section id="providers" className="services">
            <h2 className="section-title">Nossos Prestadores</h2>
            
            <div style={{ maxWidth: '800px', margin: '0 auto 3rem', padding: '0 2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ flex: '1', minWidth: '250px' }}>
                        <input
                            type="text"
                            placeholder="Buscar por nome, serviço ou localização..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                            style={{ width: '100%' }}
                        />
                    </div>
                    
                    <div style={{ minWidth: '200px' }}>
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="form-select"
                            style={{ width: '100%' }}
                        >
                            {serviceOptions.map(service => (
                                <option key={service} value={service === 'Todos' ? '' : service}>
                                    {service}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {filteredProviders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <i className="fas fa-search" style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}></i>
                    <h3>Nenhum prestador encontrado</h3>
                    <p>Tente ajustar os filtros de busca</p>
                </div>
            ) : (
                <div className="provider-grid">
                    {filteredProviders.map(provider => (
                        <ProviderCard key={provider.id} provider={provider} />
                    ))}
                </div>
            )}
        </section>
    );
};

// Provider Card Component
const ProviderCard = ({ provider }) => {
    const storage = new DataStorage();
    const averageRating = storage.getAverageRating(provider.id);

    const handleContact = () => {
        // WhatsApp integration
        const message = `Olá ${provider.name}! Encontrei seu perfil no MultiServices e gostaria de solicitar um orçamento para ${provider.service}.`;
        const whatsappUrl = `https://wa.me/55${provider.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatappUrl, '_blank');
    };

    return (
        <div className="provider-card fade-in">
            <div style={{ position: 'relative' }}>
                <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(provider.name)}&background=3498db&color=fff&size=200`}
                    alt={provider.name}
                    className="provider-image"
                />
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'var(--secondary-color)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                }}>
                    {provider.service}
                </div>
            </div>
            
            <div className="provider-info">
                <h3 className="provider-name">{provider.name}</h3>
                
                <div className="provider-rating">
                    <span style={{ marginRight: '0.5rem' }}>
                        {Utils.generateStars(parseFloat(averageRating))}
                    </span>
                    <span>({averageRating})</span>
                </div>
                
                <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem' }}></i>
                    {provider.location}
                </p>
                
                <p style={{ marginBottom: '1rem' }}>{provider.description}</p>
                
                {provider.experience && (
                    <p style={{ marginBottom: '1rem', fontStyle: 'italic' }}>
                        <i className="fas fa-award" style={{ marginRight: '0.5rem' }}></i>
                        {provider.experience}
                    </p>
                )}
                
                {provider.hourlyRate && (
                    <p style={{ fontWeight: '600', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                        <i className="fas fa-money-bill-wave" style={{ marginRight: '0.5rem' }}></i>
                        R$ {parseFloat(provider.hourlyRate).toFixed(2)}/hora
                    </p>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={handleContact} className="btn btn-primary">
                        <i className="fab fa-whatsapp" style={{ marginRight: '0.5rem' }}></i>
                        Contatar
                    </button>
                    
                    <button onClick={() => window.location.href = `#provider-${provider.id}`} className="btn btn-outline">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        </div>
    );
};

// Client Registration Form Component
const ClientRegistrationForm = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        phone: '',
        location: ''
    });

    const [errors, setErrors] = React.useState({});
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitSuccess, setSubmitSuccess] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!FormValidator.validateRequired(formData.name)) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (!FormValidator.validateEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!FormValidator.validatePhone(formData.phone)) {
            newErrors.phone = 'Telefone inválido';
        }

        if (!FormValidator.validateRequired(formData.location)) {
            newErrors.location = 'Localização é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            setIsSubmitting(true);
            
            setTimeout(() => {
                const storage = new DataStorage();
                storage.saveClient(formData);
                
                setIsSubmitting(false);
                setSubmitSuccess(true);
                
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    location: ''
                });
                
                setTimeout(() => setSubmitSuccess(false), 3000);
            }, 1000);
        }
    };

    return (
        <div className="form-container">
            <h2 className="section-title">Cadastro de Cliente</h2>
            
            {submitSuccess && (
                <div style={{
                    background: 'var(--success-color)',
                    color: 'white',
                    padding: '1rem',
                    borderRadius: '5px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                }}>
                    <i className="fas fa-check-circle"></i> Cadastro realizado com sucesso!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nome Completo *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Seu nome completo"
                    />
                    {errors.name && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="seu@email.com"
                    />
                    {errors.email && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Telefone *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="(11) 99999-9999"
                    />
                    {errors.phone && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label className="form-label">Localização *</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Cidade - Estado"
                    />
                    {errors.location && <span style={{ color: 'var(--accent-color)', fontSize: '0.9rem' }}>{errors.location}</span>}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    style={{ width: '100%' }}
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading"></span> Cadastrando...
                        </>
                    ) : (
                        'Cadastrar como Cliente'
                    )}
                </button>
            </form>
        </div>
    );
};

// Initialize sample data when the script loads
initializeSampleData();
