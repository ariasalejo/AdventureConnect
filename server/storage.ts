import { 
  users, type User, type InsertUser,
  articles, type Article, type InsertArticle,
  categories, type Category, type InsertCategory,
  breakingNews, type BreakingNews, type InsertBreakingNews,
  newsletters, type Newsletter, type InsertNewsletter
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Article methods
  getAllArticles(limit?: number): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticlesByCategory(categorySlug: string): Promise<Article[]>;
  getFeaturedArticles(limit?: number): Promise<Article[]>;
  getLatestArticles(limit?: number): Promise<Article[]>;
  getPopularArticles(limit?: number): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  searchArticles(query: string): Promise<Article[]>;
  
  // Breaking News methods
  getActiveBreakingNews(): Promise<BreakingNews[]>;
  createBreakingNews(news: InsertBreakingNews): Promise<BreakingNews>;
  
  // Newsletter methods
  subscribeToNewsletter(subscription: InsertNewsletter): Promise<Newsletter>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private categories: Map<number, Category>;
  private breakingNews: Map<number, BreakingNews>;
  private newsletters: Map<number, Newsletter>;
  
  private userId: number;
  private articleId: number;
  private categoryId: number;
  private breakingNewsId: number;
  private newsletterId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.categories = new Map();
    this.breakingNews = new Map();
    this.newsletters = new Map();
    
    this.userId = 1;
    this.articleId = 1;
    this.categoryId = 1;
    this.breakingNewsId = 1;
    this.newsletterId = 1;
    
    // Initialize with default data
    this.initializeData();
  }

  private initializeData() {
    // Add categories
    const categoriesData: InsertCategory[] = [
      { name: "Política", slug: "politica" },
      { name: "Economía", slug: "economia" },
      { name: "Internacional", slug: "internacional" },
      { name: "Tecnología", slug: "tecnologia" },
      { name: "Deportes", slug: "deportes" },
      { name: "Cultura", slug: "cultura" },
      { name: "Ciencia", slug: "ciencia" },
      { name: "Salud", slug: "salud" }
    ];
    
    const categoryMap = new Map<string, number>();
    
    categoriesData.forEach(categoryData => {
      const category = this.createCategory(categoryData);
      categoryMap.set(category.slug, category.id);
    });
    
    // Add articles
    const articlesData: Omit<InsertArticle, "categoryId">[] = [
      {
        title: "La OMS declara el fin de la emergencia sanitaria global por COVID-19",
        slug: "oms-fin-emergencia-covid",
        summary: "Después de más de tres años, la Organización Mundial de la Salud ha anunciado oficialmente el fin de la emergencia sanitaria global causada por la pandemia de COVID-19, aunque advierte que el virus sigue siendo una amenaza.",
        content: `<p>La Organización Mundial de la Salud (OMS) ha anunciado oficialmente el fin de la emergencia sanitaria global causada por el COVID-19, después de más de tres años de pandemia que ha afectado a prácticamente todos los países del mundo.</p>
          <p>Durante una rueda de prensa celebrada en Ginebra, el director general de la OMS, Tedros Adhanom Ghebreyesus, declaró que "con gran esperanza declaro el fin del COVID-19 como emergencia sanitaria de preocupación internacional". Sin embargo, advirtió que esto no significa que el virus haya dejado de ser una amenaza para la salud mundial.</p>
          <p>"El virus sigue circulando y sigue matando, y sigue cambiando. El riesgo de que surjan nuevas variantes continúa", explicó Tedros, instando a los países a mantener la vigilancia y a seguir vacunando a sus poblaciones, especialmente a los grupos más vulnerables.</p>
          <p>La decisión de la OMS se basa en la reducción significativa de muertes y hospitalizaciones a nivel mundial en los últimos meses, así como en los altos niveles de inmunidad alcanzados en muchos países gracias a la vacunación y a la infección natural.</p>
          <p>El COVID-19 fue declarado emergencia sanitaria de preocupación internacional el 30 de enero de 2020, cuando el virus apenas comenzaba a extenderse fuera de China. Desde entonces, ha infectado a más de 760 millones de personas en todo el mundo y ha causado al menos 7 millones de muertes, según los datos oficiales, aunque se estima que la cifra real podría ser mucho mayor.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=650&q=80",
        author: "María González",
        publishedAt: new Date("2023-05-05"),
        isFeatured: true,
        isBreakingNews: true,
        readTime: 5,
        commentCount: 42,
        shareCount: 38,
        tags: ["covid-19", "salud", "oms", "pandemia"]
      },
      {
        title: "El banco central anuncia nueva subida de tipos de interés",
        slug: "banco-central-subida-tipos-interes",
        summary: "La decisión busca controlar la inflación que sigue por encima del objetivo del 2% establecido por la institución.",
        content: `<p>El Banco Central Europeo (BCE) ha anunciado hoy una nueva subida de los tipos de interés de 0,25 puntos porcentuales, llevando la tasa de referencia al 3,75%, el nivel más alto desde 2008.</p>
          <p>La presidenta del BCE, Christine Lagarde, ha justificado la decisión como necesaria para controlar la inflación, que aunque ha descendido en los últimos meses, sigue manteniéndose por encima del objetivo del 2% establecido por la institución monetaria.</p>
          <p>"La inflación subyacente sigue siendo demasiado alta y persistente. Necesitamos asegurarnos de que retorna a nuestro objetivo a medio plazo", declaró Lagarde durante la rueda de prensa posterior a la reunión del Consejo de Gobierno.</p>
          <p>Esta es la séptima subida consecutiva de tipos por parte del BCE desde julio de 2022, cuando decidió abandonar las tasas negativas que había mantenido durante años como estímulo para la economía europea.</p>
          <p>Los analistas esperan que el ciclo de subidas podría estar llegando a su fin, aunque todo dependerá de la evolución de los datos económicos en los próximos meses, especialmente los de inflación y empleo.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        author: "Carlos Martínez",
        publishedAt: new Date("2023-05-04"),
        isFeatured: true,
        isBreakingNews: false,
        readTime: 4,
        commentCount: 18,
        shareCount: 12,
        tags: ["economía", "banco central", "tipos de interés", "inflación"]
      },
      {
        title: "El Real Madrid se clasifica para la final de la Liga de Campeones",
        slug: "real-madrid-final-champions",
        summary: "Una remontada histórica en el Santiago Bernabéu permite al equipo blanco acceder a su decimoséptima final.",
        content: `<p>El Real Madrid consiguió anoche una clasificación épica para la final de la Liga de Campeones tras derrotar al Manchester City por 3-1 en el partido de vuelta de semifinales disputado en el estadio Santiago Bernabéu.</p>
          <p>El equipo inglés se adelantó en el marcador con un gol de Mahrez en el minuto 73, pero el conjunto madridista, cuando parecía eliminado, logró una remontada histórica con dos goles de Rodrygo en el minuto 90 y 91, llevando el partido a la prórroga.</p>
          <p>En el tiempo extra, Benzema sentenció la eliminatoria al transformar un penalti en el minuto 95, dando al Real Madrid el pase a su decimoséptima final de Copa de Europa/Liga de Campeones.</p>
          <p>"Es inexplicable lo que ocurre en este estadio. Es la magia del Bernabéu, es la historia de este club", declaró el entrenador Carlo Ancelotti tras el partido. "Estos jugadores nunca se rinden, tienen un carácter y una calidad extraordinarios".</p>
          <p>El Real Madrid se enfrentará al Liverpool en la final que se disputará el próximo 28 de mayo en París, en una reedición de las finales de 1981, 2018 y 2022.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        author: "Javier López",
        publishedAt: new Date("2023-05-03"),
        isFeatured: true,
        isBreakingNews: false,
        readTime: 3,
        commentCount: 87,
        shareCount: 56,
        tags: ["deportes", "fútbol", "champions league", "real madrid"]
      },
      {
        title: "Apple presenta su nueva generación de procesadores M3",
        slug: "apple-procesadores-m3",
        summary: "Los nuevos chips prometen un rendimiento hasta un 40% superior y mayor eficiencia energética que sus predecesores.",
        content: `<p>Apple ha presentado hoy su nueva generación de procesadores M3, que equiparán a los próximos modelos de Mac y que prometen un rendimiento hasta un 40% superior al de la generación anterior, junto con mejoras significativas en la eficiencia energética.</p>
          <p>Durante un evento virtual transmitido desde su sede en Cupertino, California, el CEO de Apple, Tim Cook, describió los nuevos chips como "el salto más importante en rendimiento y eficiencia en la historia de Mac".</p>
          <p>Los procesadores M3, fabricados con tecnología de 3 nanómetros, incluyen hasta 16 núcleos de CPU, 40 núcleos de GPU y 32 GB de memoria unificada. Apple afirma que las nuevas GPU son hasta 2,5 veces más rápidas que las de la generación M1 cuando se ejecutan con batería.</p>
          <p>Además del rendimiento mejorado, los nuevos chips incorporan un nuevo motor de renderizado que permite mejor calidad gráfica y soporte para ray tracing por hardware, lo que beneficiará especialmente a profesionales del diseño y desarrolladores de juegos.</p>
          <p>Los primeros dispositivos equipados con los nuevos procesadores M3 serán los MacBook Pro de 14 y 16 pulgadas y el iMac, que ya están disponibles para reserva y comenzarán a entregarse la próxima semana.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=500&q=80",
        author: "Laura Sánchez",
        publishedAt: new Date("2023-05-02"),
        isFeatured: true,
        isBreakingNews: false,
        readTime: 4,
        commentCount: 56,
        shareCount: 43,
        tags: ["tecnología", "apple", "procesadores", "m3"]
      },
      {
        title: "El Parlamento aprueba la nueva ley de vivienda tras intenso debate",
        slug: "parlamento-ley-vivienda",
        summary: "La normativa, que incluye medidas para regular los precios del alquiler en zonas tensionadas, ha sido aprobada con 176 votos a favor y 173 en contra después de meses de negociaciones.",
        content: `<p>El Parlamento ha aprobado hoy la nueva Ley de Vivienda tras un intenso debate parlamentario que se ha extendido durante más de ocho horas. La normativa ha salido adelante con 176 votos a favor, 173 en contra y 1 abstención.</p>
          <p>Entre las principales medidas que recoge la ley destaca la regulación de los precios del alquiler en las denominadas "zonas tensionadas", donde el coste de la vivienda supera el 30% de los ingresos medios de los hogares o donde los precios han subido más de tres puntos por encima del IPC en los últimos cinco años.</p>
          <p>La ley también establece un recargo de hasta el 150% en el IBI para viviendas vacías, limita las subidas del alquiler al índice de referencia que establecerá el Gobierno (con un máximo del 3% para 2024), y obliga a los grandes tenedores a ofrecer alquiler social a inquilinos vulnerables antes de proceder a un desahucio.</p>
          <p>El ministro de Vivienda ha calificado la aprobación como "un día histórico para la protección del derecho a la vivienda en España", mientras que la oposición ha criticado la ley por considerar que "generará inseguridad jurídica y desincentivará la oferta de vivienda en alquiler".</p>
          <p>La nueva ley entrará en vigor una vez sea publicada en el Boletín Oficial del Estado, lo que se espera que ocurra en las próximas semanas.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        author: "Carlos Rodríguez",
        publishedAt: new Date("2023-05-04"),
        isFeatured: false,
        isBreakingNews: false,
        readTime: 5,
        commentCount: 24,
        shareCount: 18,
        tags: ["política", "vivienda", "alquiler", "parlamento"]
      },
      {
        title: "Concluye sin acuerdo la cumbre sobre el cambio climático",
        slug: "cumbre-cambio-climatico-sin-acuerdo",
        summary: "Los representantes de más de 190 países no lograron consensuar medidas vinculantes para reducir las emisiones de gases de efecto invernadero, posponiendo las decisiones hasta la próxima cumbre.",
        content: `<p>La Conferencia de las Naciones Unidas sobre el Cambio Climático (COP28) ha concluido hoy sin lograr un acuerdo sobre las medidas vinculantes para reducir las emisiones de gases de efecto invernadero, en lo que muchos observadores consideran un fracaso de la diplomacia climática internacional.</p>
          <p>Tras dos semanas de intensas negociaciones en Dubai, los representantes de más de 190 países solo consiguieron acordar una declaración de intenciones que pospone las decisiones más importantes hasta la próxima cumbre, que se celebrará el año que viene en Brasil.</p>
          <p>El principal punto de desacuerdo fue la financiación climática y el ritmo de abandono de los combustibles fósiles. Los países en desarrollo exigían compromisos más firmes de financiación por parte de las naciones industrializadas, mientras que estas presionaban para que las economías emergentes, especialmente China e India, asumieran mayores compromisos de reducción de emisiones.</p>
          <p>"Es profundamente decepcionante que no hayamos podido alcanzar un acuerdo a la altura del desafío que enfrentamos", declaró el Secretario General de la ONU, António Guterres. "Cada año de inacción tiene consecuencias devastadoras para nuestro planeta".</p>
          <p>Grupos ecologistas han criticado duramente el resultado de la cumbre, calificándolo de "traición a las futuras generaciones" y advirtiendo que el tiempo para evitar los peores efectos del cambio climático se está agotando rápidamente.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1580377968131-31df95eb275c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        author: "Ana Martínez",
        publishedAt: new Date("2023-05-03"),
        isFeatured: false,
        isBreakingNews: false,
        readTime: 6,
        commentCount: 42,
        shareCount: 56,
        tags: ["internacional", "cambio climático", "cop28", "medio ambiente"]
      },
      {
        title: "Científicos logran avance significativo en la cura del Alzheimer",
        slug: "avance-cura-alzheimer",
        summary: "Un equipo internacional de investigadores ha identificado un nuevo mecanismo molecular que podría convertirse en diana terapéutica para tratar la enfermedad en sus etapas iniciales.",
        content: `<p>Un equipo internacional de científicos liderado por el Centro Nacional de Investigaciones Cardiovasculares (CNIC) ha logrado un avance significativo en la comprensión y potencial tratamiento del Alzheimer al identificar un nuevo mecanismo molecular implicado en el desarrollo de la enfermedad.</p>
          <p>Según el estudio, publicado hoy en la revista Nature, los investigadores han descubierto que una proteína denominada SFRP1 juega un papel crucial en la formación de las placas amiloides, uno de los principales marcadores del Alzheimer.</p>
          <p>"Hemos comprobado que al inhibir la acción de esta proteína en modelos animales, se reduce significativamente la formación de placas amiloides y se mejoran los déficits cognitivos asociados con la enfermedad", explica la Dra. María Ángeles Moro, investigadora principal del estudio.</p>
          <p>Este hallazgo abre una nueva vía para el desarrollo de tratamientos que podrían actuar en las etapas iniciales de la enfermedad, antes de que se produzca un daño neuronal irreversible. Los investigadores ya están trabajando en el desarrollo de moléculas que puedan inhibir específicamente la proteína SFRP1 y que podrían entrar en ensayos clínicos en los próximos años.</p>
          <p>El Alzheimer afecta a más de 50 millones de personas en todo el mundo y es la causa más común de demencia entre las personas mayores. Hasta ahora, los tratamientos disponibles solo consiguen aliviar algunos síntomas, pero no logran detener o revertir el progreso de la enfermedad.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        author: "Eduardo Sánchez",
        publishedAt: new Date("2023-05-02"),
        isFeatured: false,
        isBreakingNews: false,
        readTime: 5,
        commentCount: 18,
        shareCount: 31,
        tags: ["ciencia", "salud", "alzheimer", "investigación"]
      },
      {
        title: "El festival de cine de Cannes anuncia la programación de su 76ª edición",
        slug: "festival-cannes-programacion",
        summary: "La nueva película de Martin Scorsese inaugurará el certamen, que contará con tres cintas españolas en la sección oficial y un homenaje especial a la actriz Meryl Streep.",
        content: `<p>El Festival de Cine de Cannes ha anunciado hoy la programación completa de su 76ª edición, que se celebrará del 14 al 25 de mayo en la ciudad francesa de la Costa Azul.</p>
          <p>La nueva película de Martin Scorsese, "Killers of the Flower Moon", protagonizada por Leonardo DiCaprio y Robert De Niro, será la encargada de inaugurar el certamen fuera de competición. El director estadounidense regresa así al festival donde ganó la Palma de Oro en 1976 con "Taxi Driver".</p>
          <p>La sección oficial contará con 21 películas que competirán por la Palma de Oro, entre ellas las nuevas obras de directores como Wes Anderson, Nanni Moretti, Hirokazu Kore-eda y Pedro Almodóvar, quien presenta su primera película en inglés, "Manual para mujeres de la limpieza", protagonizada por Cate Blanchett y Tilda Swinton.</p>
          <p>El cine español estará especialmente representado en esta edición, con tres películas en la sección oficial: además de la de Almodóvar, competirán "Robot Dreams" de Pablo Berger y "Cerrar los ojos" de Víctor Erice, quien regresa al cine tras un paréntesis de 30 años.</p>
          <p>El festival también rendirá un homenaje especial a la actriz Meryl Streep, quien recibirá una Palma de Oro honorífica por su trayectoria profesional. La actriz estadounidense, ganadora de tres premios Oscar y nominada en 21 ocasiones, presidirá además la gala de inauguración del certamen.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        author: "Laura Fernández",
        publishedAt: new Date("2023-05-01"),
        isFeatured: false,
        isBreakingNews: false,
        readTime: 4,
        commentCount: 12,
        shareCount: 8,
        tags: ["cultura", "cine", "festival de cannes", "martin scorsese"]
      },
      {
        title: "Las bolsas europeas registran su mejor semana en seis meses tras decisión del BCE",
        slug: "bolsas-europeas-mejor-semana",
        summary: "Los mercados financieros europeos cerraron con fuertes ganancias después de que el Banco Central Europeo señalara una posible pausa en las subidas de tipos de interés.",
        content: `<p>Las principales bolsas europeas han registrado esta semana su mejor comportamiento en los últimos seis meses, con ganancias acumuladas que superan el 3% en la mayoría de los mercados del continente.</p>
          <p>El Ibex 35 español ha avanzado un 3,8%, mientras que el DAX alemán ha subido un 4,2%, el CAC 40 francés un 3,5% y el FTSE MIB italiano un 4,7%. El índice paneuropeo Stoxx 600 ha cerrado la semana con una ganancia del 3,9%.</p>
          <p>Este rally alcista se ha producido tras la última reunión del Banco Central Europeo (BCE), en la que su presidenta, Christine Lagarde, sugirió que la institución podría hacer una pausa en su ciclo de subidas de tipos de interés en septiembre, dependiendo de la evolución de los datos de inflación durante el verano.</p>
          <p>"Los mercados han interpretado las declaraciones de Lagarde como una señal de que el fin del ciclo de endurecimiento monetario podría estar cerca", explica María Rodríguez, analista de Bankinter. "Esto ha provocado un fuerte apetito comprador, especialmente en sectores sensibles a los tipos como el inmobiliario y el tecnológico".</p>
          <p>Los inversores estarán ahora pendientes de la publicación de los datos de inflación de julio y agosto, que serán determinantes para la decisión que tome el BCE en su reunión de septiembre. Mientras tanto, los analistas recomiendan cautela, ya que la volatilidad podría mantenerse elevada durante las próximas semanas.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        author: "Roberto García",
        publishedAt: new Date("2023-05-05"),
        isFeatured: false,
        isBreakingNews: false,
        readTime: 3,
        commentCount: 8,
        shareCount: 15,
        tags: ["economía", "bolsa", "BCE", "mercados"]
      },
      {
        title: "La sequía obliga a restricciones de agua en cinco comunidades autónomas",
        slug: "sequia-restricciones-agua",
        summary: "La falta de precipitaciones y el descenso de los niveles de los embalses han llevado a las autoridades a implementar medidas de ahorro de agua en varias regiones del país.",
        content: `<p>Cinco comunidades autónomas —Cataluña, Andalucía, Murcia, Comunidad Valenciana y Extremadura— han anunciado hoy la implementación de restricciones en el consumo de agua debido a la grave sequía que afecta a gran parte del territorio español.</p>
          <p>Las medidas, que entrarán en vigor a partir del próximo lunes, incluyen limitaciones en el riego de jardines y zonas verdes, prohibición de llenado de piscinas privadas, cierre de fuentes ornamentales y restricciones en el suministro nocturno en las zonas más afectadas.</p>
          <p>Según datos de la Confederación Hidrográfica, los embalses españoles se encuentran actualmente al 35,2% de su capacidad, el nivel más bajo para esta época del año desde la sequía de 1995. La situación es especialmente preocupante en las cuencas del Guadalquivir (25,1%) y del Segura (21,3%).</p>
          <p>"Estamos ante una situación excepcional que requiere medidas excepcionales", ha declarado la ministra para la Transición Ecológica, quien ha pedido a la ciudadanía "un esfuerzo colectivo para reducir el consumo de agua y hacer un uso responsable de este recurso escaso".</p>
          <p>El sector agrícola, uno de los más afectados por la sequía, ya ha advertido de pérdidas millonarias en cultivos como los cereales, los cítricos y el olivar. Las organizaciones agrarias han solicitado al Gobierno la declaración de zona catastrófica para las comarcas más afectadas y la implementación de ayudas directas para los agricultores.</p>`,
        imageUrl: "https://images.unsplash.com/photo-1536244636800-a3f74db0f3cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80",
        author: "Patricia Torres",
        publishedAt: new Date("2023-05-04"),
        isFeatured: false,
        isBreakingNews: false,
        readTime: 4,
        commentCount: 31,
        shareCount: 42,
        tags: ["medio ambiente", "sequía", "agua", "restricciones"]
      }
    ];
    
    articlesData.forEach(articleData => {
      let categoryId = 1; // Default to first category
      
      // Find the appropriate category ID based on tags
      if (articleData.tags.includes("política")) {
        categoryId = categoryMap.get("politica") || 1;
      } else if (articleData.tags.includes("economía")) {
        categoryId = categoryMap.get("economia") || 1;
      } else if (articleData.tags.includes("internacional") || articleData.tags.includes("cambio climático")) {
        categoryId = categoryMap.get("internacional") || 1;
      } else if (articleData.tags.includes("tecnología")) {
        categoryId = categoryMap.get("tecnologia") || 1;
      } else if (articleData.tags.includes("deportes") || articleData.tags.includes("fútbol")) {
        categoryId = categoryMap.get("deportes") || 1;
      } else if (articleData.tags.includes("cultura") || articleData.tags.includes("cine")) {
        categoryId = categoryMap.get("cultura") || 1;
      } else if (articleData.tags.includes("ciencia")) {
        categoryId = categoryMap.get("ciencia") || 1;
      } else if (articleData.tags.includes("salud")) {
        categoryId = categoryMap.get("salud") || 1;
      }
      
      this.createArticle({
        ...articleData,
        categoryId
      });
    });
    
    // Add breaking news
    const breakingNewsData: InsertBreakingNews[] = [
      { 
        content: "Dimite el ministro de Economía tras escándalo de corrupción • Detectan nueva variante de gripe aviar en Asia • El índice bursátil cae un 3% tras anuncio del banco central",
        isActive: true
      }
    ];
    
    breakingNewsData.forEach(newsData => {
      this.createBreakingNews(newsData);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Article methods
  async getAllArticles(limit?: number): Promise<Article[]> {
    const articles = Array.from(this.articles.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    return limit ? articles.slice(0, limit) : articles;
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticlesByCategory(categorySlug: string): Promise<Article[]> {
    const category = await this.getCategoryBySlug(categorySlug);
    
    if (!category) {
      return [];
    }
    
    return Array.from(this.articles.values())
      .filter(article => article.categoryId === category.id)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getFeaturedArticles(limit: number = 4): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isFeatured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getLatestArticles(limit: number = 4): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async getPopularArticles(limit: number = 5): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => (b.commentCount + b.shareCount) - (a.commentCount + a.shareCount))
      .slice(0, limit);
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.articleId++;
    const article: Article = { ...insertArticle, id };
    this.articles.set(id, article);
    return article;
  }

  async searchArticles(query: string): Promise<Article[]> {
    const normalizedQuery = query.toLowerCase();
    
    return Array.from(this.articles.values())
      .filter(article => 
        article.title.toLowerCase().includes(normalizedQuery) || 
        article.summary.toLowerCase().includes(normalizedQuery) || 
        article.content.toLowerCase().includes(normalizedQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  // Breaking News methods
  async getActiveBreakingNews(): Promise<BreakingNews[]> {
    return Array.from(this.breakingNews.values())
      .filter(news => news.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBreakingNews(insertNews: InsertBreakingNews): Promise<BreakingNews> {
    const id = this.breakingNewsId++;
    const news: BreakingNews = { 
      ...insertNews, 
      id, 
      createdAt: new Date() 
    };
    this.breakingNews.set(id, news);
    return news;
  }

  // Newsletter methods
  async subscribeToNewsletter(insertSubscription: InsertNewsletter): Promise<Newsletter> {
    // Check if email already exists
    const existingSubscription = Array.from(this.newsletters.values()).find(
      newsletter => newsletter.email === insertSubscription.email
    );
    
    if (existingSubscription) {
      return existingSubscription;
    }
    
    const id = this.newsletterId++;
    const subscription: Newsletter = { 
      ...insertSubscription, 
      id, 
      createdAt: new Date() 
    };
    this.newsletters.set(id, subscription);
    return subscription;
  }
}

export const storage = new MemStorage();
