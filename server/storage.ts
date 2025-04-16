import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  articles, type Article, type InsertArticle,
  workshops, type Workshop, type InsertWorkshop,
  events, type Event, type InsertEvent,
  tags, type Tag, type InsertTag,
  subscribers, type Subscriber, type InsertSubscriber
} from "@shared/schema";
import { format } from "date-fns";

// Interface for storage operations
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Articles
  getAllArticles(limit?: number, offset?: number): Promise<Article[]>;
  getArticleById(id: number): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getArticlesByCategory(categoryId: number, limit?: number, offset?: number): Promise<Article[]>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getPopularArticles(limit?: number): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  incrementArticleReadCount(id: number): Promise<Article | undefined>;
  searchArticles(query: string, limit?: number): Promise<Article[]>;
  
  // Workshops
  getAllWorkshops(limit?: number): Promise<Workshop[]>;
  getWorkshopBySlug(slug: string): Promise<Workshop | undefined>;
  getFeaturedWorkshops(limit?: number): Promise<Workshop[]>;
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  
  // Events
  getAllEvents(limit?: number): Promise<Event[]>;
  getUpcomingEvents(limit?: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  
  // Tags
  getAllTags(): Promise<Tag[]>;
  getPopularTags(limit?: number): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  
  // Subscribers
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private articles: Map<number, Article>;
  private workshops: Map<number, Workshop>;
  private events: Map<number, Event>;
  private tags: Map<number, Tag>;
  private subscribers: Map<number, Subscriber>;
  
  // Auto-increment IDs
  private userCurrentId: number;
  private categoryCurrentId: number;
  private articleCurrentId: number;
  private workshopCurrentId: number;
  private eventCurrentId: number;
  private tagCurrentId: number;
  private subscriberCurrentId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.articles = new Map();
    this.workshops = new Map();
    this.events = new Map();
    this.tags = new Map();
    this.subscribers = new Map();
    
    this.userCurrentId = 1;
    this.categoryCurrentId = 1;
    this.articleCurrentId = 1;
    this.workshopCurrentId = 1;
    this.eventCurrentId = 1;
    this.tagCurrentId = 1;
    this.subscriberCurrentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Categories
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryCurrentId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
  
  // Articles
  async getAllArticles(limit: number = 10, offset: number = 0): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return articles.slice(offset, offset + limit);
  }
  
  async getArticleById(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(
      (article) => article.slug === slug,
    );
  }
  
  async getArticlesByCategory(categoryId: number, limit: number = 10, offset: number = 0): Promise<Article[]> {
    const articles = Array.from(this.articles.values())
      .filter(article => article.categoryId === categoryId)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return articles.slice(offset, offset + limit);
  }
  
  async getFeaturedArticles(limit: number = 1): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
  
  async getPopularArticles(limit: number = 5): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => b.readCount - a.readCount)
      .slice(0, limit);
  }
  
  async getLatestArticles(limit: number = 3): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleCurrentId++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    
    // Update category article count
    const category = this.categories.get(article.categoryId);
    if (category) {
      category.articleCount = (category.articleCount || 0) + 1;
      this.categories.set(category.id, category);
    }
    
    return article;
  }
  
  async incrementArticleReadCount(id: number): Promise<Article | undefined> {
    const article = this.articles.get(id);
    if (article) {
      article.readCount = (article.readCount || 0) + 1;
      this.articles.set(id, article);
      return article;
    }
    return undefined;
  }
  
  async searchArticles(query: string, limit: number = 10): Promise<Article[]> {
    const lowerCaseQuery = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => 
        article.title.toLowerCase().includes(lowerCaseQuery) || 
        article.summary.toLowerCase().includes(lowerCaseQuery) ||
        article.content.toLowerCase().includes(lowerCaseQuery)
      )
      .slice(0, limit);
  }
  
  // Workshops
  async getAllWorkshops(limit: number = 10): Promise<Workshop[]> {
    return Array.from(this.workshops.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  }
  
  async getWorkshopBySlug(slug: string): Promise<Workshop | undefined> {
    return Array.from(this.workshops.values()).find(
      (workshop) => workshop.slug === slug,
    );
  }
  
  async getFeaturedWorkshops(limit: number = 3): Promise<Workshop[]> {
    return Array.from(this.workshops.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  }
  
  async createWorkshop(insertWorkshop: InsertWorkshop): Promise<Workshop> {
    const id = this.workshopCurrentId++;
    const workshop: Workshop = { ...insertWorkshop, id };
    this.workshops.set(id, workshop);
    return workshop;
  }
  
  // Events
  async getAllEvents(limit: number = 10): Promise<Event[]> {
    return Array.from(this.events.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  }
  
  async getUpcomingEvents(limit: number = 4): Promise<Event[]> {
    const now = new Date();
    return Array.from(this.events.values())
      .filter(event => new Date(event.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limit);
  }
  
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventCurrentId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }
  
  // Tags
  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }
  
  async getPopularTags(limit: number = 10): Promise<Tag[]> {
    return Array.from(this.tags.values()).slice(0, limit);
  }
  
  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.tagCurrentId++;
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }
  
  // Subscribers
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberCurrentId++;
    const subscriber: Subscriber = { 
      ...insertSubscriber, 
      id,
      subscribedAt: new Date()
    };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  // Initialize with sample data
  private initializeData() {
    // Create sample users
    const user1 = this.createUser({ username: "admin", password: "admin" });
    
    // Create sample categories
    const categories = [
      { name: "Montañismo", slug: "montanismo", articleCount: 0 },
      { name: "Senderismo", slug: "senderismo", articleCount: 0 },
      { name: "Escalada", slug: "escalada", articleCount: 0 },
      { name: "Talleres", slug: "talleres", articleCount: 0 },
      { name: "Eventos", slug: "eventos", articleCount: 0 },
      { name: "Equipamiento", slug: "equipamiento", articleCount: 0 },
      { name: "Consejos", slug: "consejos", articleCount: 0 },
    ];
    
    categories.forEach(category => {
      this.createCategory(category);
    });
    
    // Create sample articles
    const articles = [
      {
        title: "Nueva expedición al Monte Everest bate récord de ascenso",
        slug: "nueva-expedicion-monte-everest-record",
        summary: "Un equipo internacional logra completar la subida en tiempo récord gracias a nuevas técnicas y equipamiento especializado.",
        content: `
          <p>Un equipo internacional de escaladores ha logrado lo que muchos consideraban imposible: completar la ascensión al Monte Everest en un tiempo récord, gracias a la implementación de nuevas técnicas de escalada y equipamiento especializado de última generación.</p>
          
          <p>La expedición, liderada por el reconocido alpinista Carlos Montañez, consiguió alcanzar la cima en tan solo 3 días desde el campamento base, cuando normalmente este trayecto puede llevar entre 5 y 7 días en condiciones óptimas.</p>
          
          <h2>Nuevas técnicas y equipamiento</h2>
          
          <p>Entre las innovaciones que hicieron posible este logro destacan:</p>
          
          <ul>
            <li>Equipos de oxígeno más ligeros y eficientes que reducen el peso transportado</li>
            <li>Trajes térmicos de nueva generación que mantienen la temperatura corporal con menos capas</li>
            <li>Técnicas de aclimatación rápida desarrolladas específicamente para esta expedición</li>
            <li>Monitorización constante de signos vitales mediante sensores integrados en la ropa</li>
          </ul>
          
          <p>"Ha sido una experiencia increíble que demuestra que con la tecnología adecuada y una preparación física meticulosa, podemos superar límites que creíamos infranqueables", comentó Montañez tras su regreso al campamento base.</p>
          
          <h2>Implicaciones para futuras expediciones</h2>
          
          <p>Este logro podría tener importantes implicaciones para futuras expediciones de alta montaña, no solo en el Everest sino en otras cumbres de gran altitud alrededor del mundo. La reducción del tiempo de exposición a condiciones extremas disminuye significativamente los riesgos para los alpinistas.</p>
          
          <p>Sin embargo, expertos en seguridad en montaña advierten que este récord no debe tomarse a la ligera ni intentar replicarse sin la debida preparación y equipamiento.</p>
          
          <p>"Cada expedición debe evaluar cuidadosamente sus capacidades y condiciones. Este equipo tenía años de experiencia y contaba con apoyo técnico excepcional", explica María López, especialista en seguridad de alta montaña.</p>
          
          <p>La hazaña ha sido documentada en video y formará parte de un documental que se estrenará el próximo año sobre los avances en alpinismo extremo.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        categoryId: 1,
        authorId: 1,
        authorName: "Carlos Montañez",
        authorImageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        featured: true,
        publishedAt: new Date("2023-05-12"),
        readCount: 4250
      },
      {
        title: "Nueva normativa para escaladores en Parques Nacionales",
        slug: "nueva-normativa-escaladores-parques-nacionales",
        summary: "El Ministerio de Medio Ambiente ha aprobado nuevas regulaciones que afectarán a los escaladores en todos los Parques Nacionales.",
        content: `
          <p>El Ministerio de Medio Ambiente ha aprobado nuevas regulaciones que afectarán a los escaladores en todos los Parques Nacionales. Estas normativas buscan proteger el entorno natural mientras se sigue permitiendo la práctica deportiva.</p>
          
          <p>Las nuevas normas, que entrarán en vigor a partir del próximo mes, establecen límites en el número de escaladores permitidos en determinadas zonas y períodos del año, especialmente en áreas con ecosistemas sensibles o durante épocas de nidificación de aves.</p>
          
          <h2>Principales cambios en la normativa</h2>
          
          <ul>
            <li>Se requerirá solicitar permiso con antelación para escalar en determinadas zonas protegidas</li>
            <li>Limitación del número diario de escaladores en rutas populares</li>
            <li>Prohibición temporal de la escalada en áreas de nidificación durante la primavera</li>
            <li>Mayores sanciones para quienes dañen el entorno natural o abandonen equipamiento</li>
          </ul>
          
          <p>Según Ana Ruiz, portavoz del Ministerio: "Estas medidas buscan un equilibrio entre la conservación y el disfrute responsable de nuestros espacios naturales. No se trata de prohibir, sino de regular para garantizar la sostenibilidad".</p>
          
          <h2>Reacciones del colectivo escalador</h2>
          
          <p>Las reacciones entre los aficionados a la escalada han sido diversas. Mientras algunas asociaciones comprenden la necesidad de proteger el medio ambiente, otras consideran que las restricciones son excesivas y podrían afectar negativamente a la práctica de este deporte.</p>
          
          <p>La Federación Española de Deportes de Montaña y Escalada (FEDME) ha solicitado una reunión con el Ministerio para discutir algunos puntos de la normativa que consideran "demasiado restrictivos" y proponer alternativas que permitan compatibilizar mejor la conservación con la actividad deportiva.</p>
          
          <p>Por su parte, grupos conservacionistas han aplaudido la medida, señalando que era necesaria para proteger hábitats frágiles que en algunos casos estaban sufriendo degradación por la masificación.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        categoryId: 3,
        authorId: 1,
        authorName: "Ana Ruiz",
        authorImageUrl: "https://randomuser.me/api/portraits/women/42.jpg",
        featured: false,
        publishedAt: new Date("2023-05-10"),
        readCount: 3800
      },
      {
        title: "Revolucionario equipamiento reduce el peso en un 40%",
        slug: "revolucionario-equipamiento-reduce-peso",
        summary: "Un fabricante español lanza al mercado una nueva línea de equipamiento para montaña que reduce significativamente el peso manteniendo la resistencia y durabilidad.",
        content: `
          <p>Un fabricante español lanza al mercado una nueva línea de equipamiento para montaña que reduce significativamente el peso manteniendo la resistencia y durabilidad. Los primeros tests muestran resultados prometedores.</p>
          
          <p>La empresa MontechSpain ha presentado su nueva gama "UltraLight Pro", una revolucionaria línea de equipamiento para montañismo y escalada que promete reducir el peso total del equipo en hasta un 40% sin comprometer la seguridad o durabilidad.</p>
          
          <h2>Tecnología innovadora</h2>
          
          <p>El secreto de esta reducción de peso se encuentra en el uso de nuevos materiales compuestos desarrollados originalmente para la industria aeroespacial. Estos materiales combinan fibras de carbono con polímeros avanzados que ofrecen una relación resistencia/peso nunca antes vista en equipamiento outdoor.</p>
          
          <p>"Hemos estado trabajando en esta tecnología durante más de cinco años", explica Martín López, director de innovación de la compañía. "El desafío no era solo reducir el peso, sino mantener o incluso mejorar los estándares de seguridad y durabilidad que los montañistas esperan".</p>
          
          <h2>Gama completa de productos</h2>
          
          <p>La línea UltraLight Pro incluye desde crampones y piolets hasta cascos, arneses y mosquetones. Uno de los productos más destacados es el nuevo casco "Aero", que con apenas 190 gramos ofrece mayor protección contra impactos que modelos convencionales que pesan más del doble.</p>
          
          <p>Los primeros en probar estos equipos han sido alpinistas profesionales, quienes han reportado no solo la ventaja obvia del menor peso, sino también mejoras en la ergonomía y facilidad de uso.</p>
          
          <h2>Precio: el único inconveniente</h2>
          
          <p>El principal obstáculo para la adopción masiva de estos equipos será, previsiblemente, su precio. La tecnología avanzada y los materiales especiales hacen que estos productos tengan un coste significativamente mayor que sus equivalentes convencionales.</p>
          
          <p>Sin embargo, la empresa asegura que están trabajando para optimizar los procesos de producción y poder ofrecer versiones más asequibles en un futuro próximo, manteniendo las ventajas principales de la reducción de peso.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        categoryId: 6,
        authorId: 1,
        authorName: "Martín López",
        authorImageUrl: "https://randomuser.me/api/portraits/men/15.jpg",
        featured: false,
        publishedAt: new Date("2023-05-08"),
        readCount: 3500
      },
      {
        title: "Se inauguran cinco nuevas rutas de senderismo en la Sierra",
        slug: "nuevas-rutas-senderismo-sierra",
        summary: "La Consejería de Medio Ambiente ha inaugurado cinco nuevas rutas de senderismo, ampliando así la oferta para los amantes del montañismo.",
        content: `
          <p>La Consejería de Medio Ambiente ha inaugurado cinco nuevas rutas de senderismo, ampliando así la oferta para los amantes del montañismo. Las rutas incluyen diferentes niveles de dificultad para todos los públicos.</p>
          
          <p>La red de senderos de la Sierra se amplía este mes con cinco nuevos recorridos que permitirán a los aficionados descubrir paisajes hasta ahora poco accesibles. Estas rutas, que suman más de 45 kilómetros en total, han sido diseñadas pensando en la diversidad de perfiles de senderistas.</p>
          
          <h2>Variedad para todos los niveles</h2>
          
          <p>Las nuevas rutas se clasifican en:</p>
          
          <ul>
            <li><strong>Sendero de los Robledales</strong>: 12 km de dificultad baja, ideal para familias con niños</li>
            <li><strong>Ruta del Mirador</strong>: 8 km de dificultad media-baja con espectaculares vistas panorámicas</li>
            <li><strong>Camino de las Cascadas</strong>: 7 km de dificultad media con paso por tres saltos de agua</li>
            <li><strong>Sendero de Altura</strong>: 10 km de dificultad alta que alcanza los 1.800 metros de altitud</li>
            <li><strong>Ruta Integral</strong>: 18 km de dificultad muy alta para senderistas experimentados</li>
          </ul>
          
          <p>Según Elena García, directora del proyecto: "Hemos querido crear una oferta variada que permita desde el paseo familiar hasta el reto deportivo para montañeros experimentados. Todas las rutas están perfectamente señalizadas y cuentan con paneles informativos sobre la flora y fauna local".</p>
          
          <h2>Infraestructura y conservación</h2>
          
          <p>La habilitación de estos senderos ha incluido la instalación de señalización homologada, áreas de descanso con bancos en puntos estratégicos, y pasarelas de madera en zonas húmedas para evitar la erosión del terreno.</p>
          
          <p>Las rutas han sido diseñadas siguiendo criterios de mínimo impacto ambiental, aprovechando en su mayoría caminos tradicionales y evitando atravesar zonas especialmente sensibles desde el punto de vista ecológico.</p>
          
          <p>La Consejería ha editado también una guía gratuita con información detallada de cada ruta, que puede descargarse desde su web oficial o recogerse en los centros de visitantes del Parque.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        categoryId: 2,
        authorId: 1,
        authorName: "Elena García",
        authorImageUrl: "https://randomuser.me/api/portraits/women/22.jpg",
        featured: false,
        publishedAt: new Date("2023-05-05"),
        readCount: 3100
      },
      {
        title: "Descubren nueva especie de flora en los Pirineos",
        slug: "descubren-nueva-especie-flora-pirineos",
        summary: "Investigadores han identificado una nueva especie de planta resistente a condiciones extremas en alta montaña.",
        content: `
          <p>Un equipo de botánicos de la Universidad de Barcelona ha descubierto una nueva especie de planta en los Pirineos, adaptada para sobrevivir en condiciones extremas de alta montaña. El hallazgo representa un importante avance para la botánica de montaña.</p>
          
          <p>La nueva especie, bautizada como "Saxifraga pyrenensis", es una pequeña planta que crece en grietas de rocas a más de 2.500 metros de altitud y ha desarrollado mecanismos únicos para resistir temperaturas extremadamente bajas y fuertes vientos.</p>
          
          <h2>Un descubrimiento inesperado</h2>
          
          <p>Lo sorprendente del hallazgo es que se produjo en una zona relativamente bien estudiada de los Pirineos. "Es asombroso que aún podamos encontrar nuevas especies en áreas que creíamos conocer bien", explicó la Dra. Laura Campos, quien dirigió la investigación. "Esto nos recuerda la inmensa biodiversidad que aún está por descubrir, incluso en nuestro entorno más cercano".</p>
          
          <p>La planta pasó desapercibida durante tanto tiempo debido a su pequeño tamaño y a que florece durante un período muy breve a finales de verano, cuando las expediciones botánicas son menos frecuentes en esa zona.</p>
          
          <h2>Características únicas</h2>
          
          <p>La Saxifraga pyrenensis presenta adaptaciones fascinantes que la hacen única:</p>
          
          <ul>
            <li>Un sistema radicular extremadamente desarrollado que puede penetrar varios centímetros en grietas microscópicas</li>
            <li>Capacidad para entrar en estado de latencia casi total durante los meses más fríos</li>
            <li>Flores con pigmentos especiales que absorben la máxima radiación solar posible</li>
            <li>Estructura celular resistente a la congelación que le permite sobrevivir a temperaturas inferiores a -20°C</li>
          </ul>
          
          <p>Los investigadores creen que estas adaptaciones podrían tener aplicaciones en biotecnología, especialmente en el desarrollo de cultivos más resistentes a condiciones climáticas extremas.</p>
          
          <h2>Conservación prioritaria</h2>
          
          <p>El equipo ha alertado sobre la necesidad de proteger específicamente esta especie, ya que su distribución parece estar limitada a una zona relativamente pequeña y podría verse amenazada por el cambio climático y el aumento del turismo de montaña.</p>
          
          <p>Las autoridades de los parques naturales de la zona ya han incluido la nueva especie en su catálogo de flora protegida y están considerando medidas específicas para garantizar su conservación.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        categoryId: 2,
        authorId: 1,
        authorName: "Laura Campos",
        authorImageUrl: "https://randomuser.me/api/portraits/women/33.jpg",
        featured: false,
        publishedAt: new Date("2023-05-01"),
        readCount: 4200
      },
      {
        title: "Los 10 mejores miradores para fotografiar el amanecer",
        slug: "mejores-miradores-fotografiar-amanecer",
        summary: "Guía completa de los puntos más espectaculares para capturar amaneceres en las montañas españolas.",
        content: `
          <p>Si eres un aficionado a la fotografía de paisaje, capturar un amanecer desde la cumbre de una montaña puede ser una de las experiencias más gratificantes. En este artículo, te presentamos los diez mejores miradores de España para fotografiar el alba desde las alturas.</p>
          
          <h2>1. Pico del Teide (Tenerife)</h2>
          
          <p>A 3.718 metros de altura, el amanecer desde el Teide ofrece una vista incomparable sobre el "mar de nubes" y la sombra proyectada del volcán sobre el océano. Es necesario solicitar un permiso especial para acceder a la cumbre al amanecer.</p>
          
          <h2>2. La Pedriza (Madrid)</h2>
          
          <p>Este enclave granítico en la Sierra de Guadarrama ofrece varias ubicaciones excelentes para fotografiar el amanecer, como el Yelmo o las Torres. La luz dorada iluminando las peculiares formaciones rocosas crea escenas de gran belleza.</p>
          
          <h2>3. Puig Major (Mallorca)</h2>
          
          <p>Aunque la cumbre en sí está restringida por instalaciones militares, los miradores cercanos ofrecen vistas espectaculares del amanecer sobre el Mediterráneo y la Sierra de Tramuntana.</p>
          
          <h2>4. Pico Urriellu o Naranjo de Bulnes (Asturias)</h2>
          
          <p>La imagen del primer sol iluminando esta emblemática cumbre de los Picos de Europa es un clásico de la fotografía de montaña. El refugio de Urriellu es un buen punto de partida.</p>
          
          <h2>5. Montsant (Tarragona)</h2>
          
          <p>Esta sierra ofrece panorámicas excepcionales del amanecer sobre el mar de viñedos del Priorat. La Roca Corbatera es uno de los mejores puntos para los fotógrafos.</p>
          
          <h2>6. Ordesa y Monte Perdido (Huesca)</h2>
          
          <p>El mirador de Calcilarruego permite contemplar cómo los primeros rayos del sol iluminan progresivamente las paredes del impresionante Valle de Ordesa.</p>
          
          <h2>7. Sierra Nevada (Granada)</h2>
          
          <p>Desde el Veleta o el Mulhacén, los dos picos más altos de la península, se puede fotografiar el amanecer con África y el Mediterráneo como telón de fondo en días despejados.</p>
          
          <h2>8. Montserrat (Barcelona)</h2>
          
          <p>Las peculiares formaciones rocosas de esta montaña crean siluetas únicas contra el cielo del amanecer. Sant Jeroni ofrece una de las mejores perspectivas.</p>
          
          <h2>9. Picos de Urbión (Soria)</h2>
          
          <p>El amanecer en la Laguna Negra o desde el pico Urbión proporciona escenas místicas, especialmente en otoño cuando la niebla suele cubrir los bosques circundantes.</p>
          
          <h2>10. Aneto (Huesca)</h2>
          
          <p>El techo de los Pirineos ofrece una vista privilegiada del amanecer sobre toda la cordillera. Si tienes suerte, podrás fotografiar el fenómeno conocido como "rayo verde" justo cuando el sol asoma por el horizonte.</p>
          
          <h2>Consejos prácticos para la fotografía de amanecer en montaña</h2>
          
          <ul>
            <li>Llega al punto elegido al menos 30 minutos antes de la hora oficial del amanecer</li>
            <li>Lleva trípode para las tomas con poca luz</li>
            <li>No te olvides de una linterna frontal para el ascenso nocturno</li>
            <li>Incluye filtros degradados para equilibrar la exposición entre el cielo y el terreno</li>
            <li>Recuerda que la temperatura será significativamente más baja al amanecer, viste por capas</li>
          </ul>
          
          <p>Fotografiar amaneceres en montaña requiere esfuerzo y planificación, pero las imágenes resultantes bien merecen madrugar y afrontar temperaturas frías. ¡Comparte tus capturas con nosotros!</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        categoryId: 2,
        authorId: 1,
        authorName: "Pablo Serrano",
        authorImageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
        featured: false,
        publishedAt: new Date("2023-04-28"),
        readCount: 3800
      },
      {
        title: "Guía definitiva de supervivencia en montaña",
        slug: "guia-supervivencia-montana",
        summary: "Aprende las técnicas y conocimientos esenciales para afrontar situaciones de emergencia en entornos montañosos.",
        content: `
          <p>La montaña es un entorno tan hermoso como imprevisible. Incluso los excursionistas más experimentados pueden encontrarse en situaciones de emergencia debido a cambios meteorológicos repentinos, accidentes o desorientación. Esta guía proporciona los conocimientos básicos que todo aficionado a la montaña debería dominar.</p>
          
          <h2>Preparación: la clave de la supervivencia</h2>
          
          <p>La mejor estrategia de supervivencia es la prevención. Antes de cualquier salida:</p>
          
          <ul>
            <li>Estudia la ruta y familiarízate con el terreno mediante mapas actualizados</li>
            <li>Consulta varias fuentes de previsión meteorológica específicas para montaña</li>
            <li>Informa a terceros sobre tu itinerario y hora prevista de regreso</li>
            <li>Comprueba el estado y funcionamiento de todo tu equipo</li>
            <li>Adapta la ruta a la experiencia y capacidad física del miembro menos preparado del grupo</li>
          </ul>
          
          <h2>El kit esencial de supervivencia</h2>
          
          <p>Además del equipamiento habitual, un pequeño kit de supervivencia no ocupa mucho espacio y puede marcar la diferencia:</p>
          
          <ul>
            <li>Navaja multiusos de calidad</li>
            <li>Encendedor y cerillas resistentes al agua</li>
            <li>Brújula (no confíes únicamente en dispositivos electrónicos)</li>
            <li>Silbato (su sonido alcanza mayor distancia que la voz humana)</li>
            <li>Manta térmica</li>
            <li>Kit básico de primeros auxilios</li>
            <li>Pastillas potabilizadoras de agua</li>
            <li>Cordino de paracord (resistente y multiuso)</li>
            <li>Linterna frontal con baterías de repuesto</li>
            <li>Raciones de emergencia (barritas energéticas de larga duración)</li>
          </ul>
          
          <h2>Si te pierdes: protocolo STOP</h2>
          
          <p>En caso de desorientación, sigue el protocolo STOP:</p>
          
          <ul>
            <li><strong>S</strong>top (Detente): No sigas caminando al azar, solo empeorarás la situación</li>
            <li><strong>T</strong>hink (Piensa): Mantén la calma y evalúa tu situación objetivamente</li>
            <li><strong>O</strong>bserve (Observa): Utiliza mapas, referencias visuales y la brújula para ubicarte</li>
            <li><strong>P</strong>lan (Planifica): Decide tu mejor curso de acción basándote en la información disponible</li>
          </ul>
          
          <h2>Construcción de refugios improvisados</h2>
          
          <p>Un refugio adecuado te protegerá de la hipotermia, principal causa de muerte en situaciones de supervivencia en montaña. Algunos refugios básicos que puedes construir:</p>
          
          <ul>
            <li><strong>Refugio de manta térmica</strong>: Utiliza cordino para tensar la manta entre árboles o rocas, creando un techo impermeable</li>
            <li><strong>Aprovecha cuevas naturales</strong>: Pero comprueba primero que no estén habitadas por animales</li>
            <li><strong>Refugio de nieve</strong>: En condiciones invernales, un hoyo en la nieve cubierto con ramas puede proporcionar un aislamiento sorprendentemente bueno</li>
          </ul>
          
          <h2>Obtención de agua</h2>
          
          <p>Puedes sobrevivir semanas sin comida, pero solo días sin agua. Si agotas tus reservas:</p>
          
          <ul>
            <li>Busca agua en zonas de vegetación abundante</li>
            <li>Recoge agua de lluvia con tu manta térmica</li>
            <li>Sigue el vuelo de pájaros al amanecer o atardecer, suelen dirigirse a fuentes de agua</li>
            <li>Derrite nieve o hielo (pero nunca los consumas directamente, causan hipotermia)</li>
            <li>Siempre potabiliza el agua mediante ebullición o pastillas potabilizadoras</li>
          </ul>
          
          <h2>Señales internacionales de socorro</h2>
          
          <p>Para comunicar tu situación de emergencia:</p>
          
          <ul>
            <li><strong>Señal visual o acústica</strong>: Seis señales en un minuto, pausa de un minuto, repetir</li>
            <li><strong>Con linterna o espejo</strong>: Tres destellos cortos, tres largos, tres cortos (código SOS)</li>
            <li><strong>Con silbato</strong>: Tres pitidos cortos, pausa, repetir</li>
            <li><strong>Señal en el suelo</strong>: Forma una X grande con materiales contrastantes</li>
          </ul>
          
          <p>Recuerda que la mejor supervivencia es aquella que nunca necesitas poner en práctica. La planificación, el equipamiento adecuado y la prudencia son tus mejores aliados en la montaña.</p>
        `,
        imageUrl: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        categoryId: 7,
        authorId: 1,
        authorName: "Ricardo Montero",
        authorImageUrl: "https://randomuser.me/api/portraits/men/55.jpg",
        featured: false,
        publishedAt: new Date("2023-04-25"),
        readCount: 3500
      }
    ];
    
    articles.forEach(article => {
      this.createArticle(article);
    });
    
    // Create sample workshops
    const workshops = [
      {
        title: "Taller de escalada avanzada",
        slug: "taller-escalada-avanzada",
        description: "Aprende técnicas avanzadas de escalada con expertos del sector.",
        imageUrl: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        date: new Date("2023-05-15"),
        startTime: "10:00",
        endTime: "17:00",
        price: 45,
        availableSpots: 5,
        location: "Centro de Escalada Urbana, Madrid"
      },
      {
        title: "Curso de supervivencia",
        slug: "curso-supervivencia",
        description: "Aprende habilidades esenciales para sobrevivir en la naturaleza.",
        imageUrl: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        date: new Date("2023-05-20"),
        startTime: "09:00",
        endTime: "18:00",
        price: 75,
        availableSpots: 2,
        location: "Sierra de Guadarrama, Madrid"
      },
      {
        title: "Fotografía de naturaleza",
        slug: "fotografia-naturaleza",
        description: "Captura la belleza de la naturaleza con nuestro taller práctico.",
        imageUrl: "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        date: new Date("2023-05-18"),
        startTime: "14:00",
        endTime: "19:00",
        price: 35,
        availableSpots: 0,
        location: "Parque Nacional Sierra de Guadarrama"
      }
    ];
    
    workshops.forEach(workshop => {
      this.createWorkshop(workshop);
    });
    
    // Create sample events
    const events = [
      {
        title: "Maratón de Montaña Sierra Norte",
        description: "Competición de resistencia por los senderos más desafiantes de la Sierra Norte.",
        date: new Date("2023-05-22"),
        location: "Sierra Norte, Madrid",
        price: "A partir de 25€",
        buttonText: "Inscribirse",
        buttonAction: "register",
        borderColor: "#ED8936" // accent
      },
      {
        title: "Feria del Equipamiento Outdoor",
        description: "Las últimas novedades en equipamiento para actividades al aire libre.",
        date: new Date("2023-05-28"),
        location: "IFEMA, Madrid",
        price: "Entrada gratuita",
        buttonText: "Más información",
        buttonAction: "info",
        borderColor: "#2B6CB0" // primary
      },
      {
        title: "Día Mundial del Medio Ambiente",
        description: "Jornada de limpieza y concienciación en espacios naturales.",
        date: new Date("2023-06-05"),
        location: "Varios puntos de España",
        price: "Participación voluntaria",
        buttonText: "Participar",
        buttonAction: "participate",
        borderColor: "#48BB78" // secondary
      },
      {
        title: "Encuentro de Escaladores",
        description: "Comparte experiencias con otros escaladores y aprende nuevas técnicas.",
        date: new Date("2023-06-12"),
        location: "La Pedriza, Madrid",
        price: "10€ (incluye comida)",
        buttonText: "Inscribirse",
        buttonAction: "register",
        borderColor: "#ED8936" // accent
      }
    ];
    
    events.forEach(event => {
      this.createEvent(event);
    });
    
    // Create sample tags
    const tags = [
      { name: "Montañismo", slug: "montanismo" },
      { name: "Escalada", slug: "escalada" },
      { name: "Equipamiento", slug: "equipamiento" },
      { name: "Senderismo", slug: "senderismo" },
      { name: "Supervivencia", slug: "supervivencia" },
      { name: "Fotografía", slug: "fotografia" },
      { name: "Pirineos", slug: "pirineos" },
      { name: "SierraNevada", slug: "sierra-nevada" },
      { name: "Acampada", slug: "acampada" },
      { name: "Everest", slug: "everest" },
      { name: "MedioAmbiente", slug: "medio-ambiente" }
    ];
    
    tags.forEach(tag => {
      this.createTag(tag);
    });
  }
}

export const storage = new MemStorage();
