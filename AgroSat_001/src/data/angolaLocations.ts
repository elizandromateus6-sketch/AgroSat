export interface AngolaLocation {
  name: string;
  province: string;
  type: 'municipio' | 'comuna' | 'polo_agricola' | 'capital';
  lat: number;
  lng: number;
  zoom: number;
  description?: string;
  isNewDPA?: boolean; // Indicador da Nova Divisão Político-Administrativa (Lei n.º 14/24)
}

export interface ProvinceInfo {
  name: string;
  capital: string;
  lat: number;
  lng: number;
  zoom: number;
  agriculturalFocus: string;
  isNewProvince?: boolean;
  notes?: string;
}

/**
 * 21 Províncias Oficiais da República de Angola
 * De acordo com a Nova Divisão Político-Administrativa (Lei n.º 14/24)
 */
export const ANGOLA_21_PROVINCES = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cubango',
  'Cunene',
  'Huambo',
  'Huíla',
  'Ícolo e Bengo',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Moxico Leste',
  'Namibe',
  'Uíge',
  'Zaire',
] as const;

export type AngolaProvince = typeof ANGOLA_21_PROVINCES[number];

/**
 * Configuração e Coordenadas Centrais das 21 Províncias da Nova DPA
 */
export const ANGOLA_PROVINCES_CONFIG: Record<string, ProvinceInfo> = {
  'Bengo': {
    name: 'Bengo',
    capital: 'Caxito',
    lat: -8.5811,
    lng: 13.6644,
    zoom: 12,
    agriculturalFocus: 'Banana de mesa, manga, mandioca, palmeira de dendém e hortícolas irrigadas no Vale do Dande.',
  },
  'Benguela': {
    name: 'Benguela',
    capital: 'Benguela',
    lat: -12.5763,
    lng: 13.4055,
    zoom: 12,
    agriculturalFocus: 'Polo hortofrutícola do Dombe Grande, milho, banana, feijão, cana-de-açúcar, sal e pecuária.',
  },
  'Bié': {
    name: 'Bié',
    capital: 'Cuíto',
    lat: -12.3833,
    lng: 16.9333,
    zoom: 12,
    agriculturalFocus: 'Batata-rena, milho, arroz de sequeiro, feijão, café e trigo no planalto bieno.',
  },
  'Cabinda': {
    name: 'Cabinda',
    capital: 'Cabinda',
    lat: -5.5567,
    lng: 12.1974,
    zoom: 12,
    agriculturalFocus: 'Cacau, café robusta, banana pão, óleo de palma, mandioca e silvicultura na Floresta do Maiombe.',
  },
  'Cuando': {
    name: 'Cuando',
    capital: 'Mavinga',
    lat: -15.7933,
    lng: 20.3667,
    zoom: 12,
    agriculturalFocus: 'Bacia hidrográfica do Rio Cuando, arroz, milho, massambala, recursos florestais e apicultura.',
    isNewProvince: true,
    notes: 'Nova província criada pela Lei da DPA resultante do desmembramento do Cuando Cubango.',
  },
  'Cuanza Norte': {
    name: 'Cuanza Norte',
    capital: 'Ndalatando',
    lat: -9.3000,
    lng: 14.9167,
    zoom: 12,
    agriculturalFocus: 'Polo pecuário de Camabatela, café arábica e robusta, banana, milho e citrinos.',
  },
  'Cuanza Sul': {
    name: 'Cuanza Sul',
    capital: 'Sumbe',
    lat: -11.2061,
    lng: 13.8437,
    zoom: 12,
    agriculturalFocus: 'Vale do Waku Kungo (maior bacia leiteira, milho e soja), Café do Libolo/Amboim e fruticultura.',
  },
  'Cubango': {
    name: 'Cubango',
    capital: 'Menongue',
    lat: -14.6591,
    lng: 17.6908,
    zoom: 12,
    agriculturalFocus: 'Vales fluviais férteis do Rio Cubango e Cuebe, pecuária, cereais rústicos (massango, massambala) e madeira.',
    isNewProvince: true,
    notes: 'Província resultante da reorganização administrativa do sudoeste de Angola.',
  },
  'Cunene': {
    name: 'Cunene',
    capital: 'Ondjiva',
    lat: -17.0667,
    lng: 15.7333,
    zoom: 11,
    agriculturalFocus: 'Grande polo pecuário de corte tradicional e comercial, massambala, massango e irrigação ao longo do Rio Cunene.',
  },
  'Huambo': {
    name: 'Huambo',
    capital: 'Huambo',
    lat: -12.7761,
    lng: 15.7392,
    zoom: 13,
    agriculturalFocus: 'Celeiro do Planalto Central: milho de alta produtividade, feijão manteiga/catarina, batata-rena, hortícolas e sementes certificadas.',
  },
  'Huíla': {
    name: 'Huíla',
    capital: 'Lubango',
    lat: -14.9172,
    lng: 13.5456,
    zoom: 12,
    agriculturalFocus: 'Perímetro Irrigado da Matala (tomate, cereais, arroz), fruticultura de clima temperado da Humpata e pecuária bovina.',
  },
  'Ícolo e Bengo': {
    name: 'Ícolo e Bengo',
    capital: 'Catete',
    lat: -9.1167,
    lng: 13.7000,
    zoom: 13,
    agriculturalFocus: 'Cinturão verde e agroindustrial do Rio Kwanza: horticultura intensiva, mandioca, cana-de-açúcar, avicultura e piscicultura.',
    isNewProvince: true,
    notes: 'Nova província criada a partir da reorganização da região metropolitana de Luanda e Kwanza.',
  },
  'Luanda': {
    name: 'Luanda',
    capital: 'Luanda (Ingombota)',
    lat: -8.8383,
    lng: 13.2344,
    zoom: 13,
    agriculturalFocus: 'Cinturão verde periurbano de hortaliças frescas, hidroponia, distribuição logística e processamento agroalimentar.',
  },
  'Lunda Norte': {
    name: 'Lunda Norte',
    capital: 'Dundo',
    lat: -7.3833,
    lng: 20.8333,
    zoom: 11,
    agriculturalFocus: 'Bacia do Rio Cuango e Cassai, mandioca, milho, arroz e projetos de diversificação agrícola.',
  },
  'Lunda Sul': {
    name: 'Lunda Sul',
    capital: 'Saurimo',
    lat: -9.6608,
    lng: 20.3916,
    zoom: 11,
    agriculturalFocus: 'Planalto de Saurimo, mandioca, feijão, amendoim, horticultura de várzea e apicultura.',
  },
  'Malanje': {
    name: 'Malanje',
    capital: 'Malanje',
    lat: -9.5402,
    lng: 16.3410,
    zoom: 13,
    agriculturalFocus: 'Polo Agroindustrial de Capanda / Quizenga (soja, milho, cana), Quêssua, Baixa de Cassanje (algodão) e mandioca de alta escala.',
  },
  'Moxico': {
    name: 'Moxico',
    capital: 'Luena',
    lat: -11.7833,
    lng: 19.9167,
    zoom: 11,
    agriculturalFocus: 'Bacia central de Moxico, mandioca (farinha musseque), arroz, mel silvestre de alta pureza e pesca fluvial.',
  },
  'Moxico Leste': {
    name: 'Moxico Leste',
    capital: 'Cazombo',
    lat: -11.8900,
    lng: 22.9100,
    zoom: 12,
    agriculturalFocus: 'Bacia do Alto Zambeze, Luau e Lago Dilolo: arroz de várzea, mandioca, feijão, milho e comércio transfronteiriço.',
    isNewProvince: true,
    notes: 'Nova província criada no leste de Angola pelo desmembramento do território do Moxico.',
  },
  'Namibe': {
    name: 'Namibe',
    capital: 'Moçâmedes',
    lat: -15.1961,
    lng: 12.1522,
    zoom: 12,
    agriculturalFocus: 'Oásis agrícolas irrigados da Bibala e Carvalhais (tomate, cebola, citrinos, videiras), olivicultura e caprinocultura.',
  },
  'Uíge': {
    name: 'Uíge',
    capital: 'Uíge',
    lat: -7.6086,
    lng: 15.0613,
    zoom: 12,
    agriculturalFocus: 'Capital do Café Robusta, polo agrícola de Negage, banana, mandioca, citrinos, abacate e amendoim.',
  },
  'Zaire': {
    name: 'Zaire',
    capital: 'Mbanza Kongo',
    lat: -6.2670,
    lng: 14.2417,
    zoom: 12,
    agriculturalFocus: 'Mandioca, feijão macunde, amendoim, citrinos, palma e agricultura de transição costeira.',
  },
};

/**
 * Coordenadas simples compatíveis com componentes de mapas
 */
export const ANGOLA_PROVINCES_COORDS: Record<string, { lat: number; lng: number; zoom?: number }> = Object.entries(
  ANGOLA_PROVINCES_CONFIG
).reduce((acc, [key, val]) => {
  acc[key] = { lat: val.lat, lng: val.lng, zoom: val.zoom };
  return acc;
}, {} as Record<string, { lat: number; lng: number; zoom?: number }>);

/**
 * Catálogo Completo de Municípios, Sedes, Polos Agrícolas e Localidades da Nova DPA (326 Municípios)
 */
export const ANGOLA_MUNICIPALITIES: AngolaLocation[] = [
  // ==========================================
  // 1. MALANJE (27 MUNICÍPIOS E POLOS AGRÍCOLAS - NOVA DPA)
  // ==========================================
  { name: 'Malanje (Sede Provincial)', province: 'Malanje', type: 'capital', lat: -9.5402, lng: 16.3410, zoom: 14, description: 'Capital de Malanje. Centro logístico e comercial agropecuário' },
  { name: 'Quêssua', province: 'Malanje', type: 'municipio', lat: -9.4500, lng: 16.4167, zoom: 14, description: 'Novo Município de Quêssua. Centro histórico agrário, Instituto Agrário de Quêssua, horticultura e milho', isNewDPA: true },
  { name: 'Cacuso', province: 'Malanje', type: 'municipio', lat: -9.4200, lng: 15.7400, zoom: 14, description: 'Polo agropecuário e logístico do Kwanza Norte-Malanje' },
  { name: 'Quizenga', province: 'Malanje', type: 'polo_agricola', lat: -9.3833, lng: 15.6500, zoom: 14, description: 'Polo Agroindustrial de Quizenga: milho, soja, feijão e agroprocessamento', isNewDPA: true },
  { name: 'Capanda', province: 'Malanje', type: 'polo_agricola', lat: -9.7900, lng: 15.4600, zoom: 14, description: 'Polo Agroindustrial de Capanda (PAC): bioenergia, cana-de-açúcar, milho e soja irrigados', isNewDPA: true },
  { name: 'Pungo a Ndongo', province: 'Malanje', type: 'municipio', lat: -9.6667, lng: 15.5833, zoom: 14, description: 'Novo Município de Pungo a Ndongo. Pedras Negras, vale fluvial e fruticultura', isNewDPA: true },
  { name: 'Calandula', province: 'Malanje', type: 'municipio', lat: -9.1833, lng: 15.9667, zoom: 14, description: 'Quedas de Calandula: mandioca, feijão, banana pão, citrinos e frutas tropicais' },
  { name: 'Cangandala', province: 'Malanje', type: 'municipio', lat: -9.7833, lng: 16.4333, zoom: 14, description: 'Santuário da Palanca Negra Gigante e bacia agrícola fértil de milho e feijão' },
  { name: 'Cambo Sunjinje', province: 'Malanje', type: 'municipio', lat: -8.7833, lng: 16.5167, zoom: 14, description: 'Novo Município de Cambo Sunjinje: agricultura de grãos e mandioca', isNewDPA: true },
  { name: 'Cateco Cangola', province: 'Malanje', type: 'municipio', lat: -8.9500, lng: 16.1167, zoom: 14, description: 'Novo Município de Cateco Cangola: cereais e leguminosas', isNewDPA: true },
  { name: 'Mbanji Ya Ngola', province: 'Malanje', type: 'municipio', lat: -9.6167, lng: 16.7167, zoom: 14, description: 'Novo Município de Mbanji Ya Ngola: mandioca e pecuária', isNewDPA: true },
  { name: 'Ngola Luije', province: 'Malanje', type: 'municipio', lat: -9.2833, lng: 16.7833, zoom: 14, description: 'Novo Município de Ngola Luije: produção de mandioca, ginguba e milho', isNewDPA: true },
  { name: 'Muquixe', province: 'Malanje', type: 'municipio', lat: -10.0500, lng: 17.2000, zoom: 14, description: 'Novo Município de Muquixe: agricultura fluvial e apicultura', isNewDPA: true },
  { name: 'Quihuhu', province: 'Malanje', type: 'municipio', lat: -9.3500, lng: 16.1500, zoom: 14, description: 'Novo Município de Quihuhu: cinturão agrícola periurbano', isNewDPA: true },
  { name: 'Quitapa', province: 'Malanje', type: 'municipio', lat: -9.1000, lng: 16.8500, zoom: 14, description: 'Novo Município de Quitapa: cereais e tubérculos', isNewDPA: true },
  { name: 'Xandel', province: 'Malanje', type: 'municipio', lat: -8.8167, lng: 16.7333, zoom: 14, description: 'Novo Município de Xandel: agricultura familiar de sequeiro', isNewDPA: true },
  { name: 'Capunda', province: 'Malanje', type: 'municipio', lat: -10.3500, lng: 16.8833, zoom: 14, description: 'Novo Município de Capunda: pastagens e feijão', isNewDPA: true },
  { name: 'Cuale', province: 'Malanje', type: 'municipio', lat: -9.0500, lng: 16.0333, zoom: 14, description: 'Novo Município de Cuale: mandioca, milho e horticultura', isNewDPA: true },
  { name: 'Milando', province: 'Malanje', type: 'municipio', lat: -8.6500, lng: 16.4500, zoom: 14, description: 'Novo Município de Milando: arroz de várzea e mandioca', isNewDPA: true },
  { name: 'Quela', province: 'Malanje', type: 'municipio', lat: -9.2667, lng: 17.0500, zoom: 14, description: 'Baixa de Cassanje: grande polo histórico de algodão, milho e girassol' },
  { name: 'Massango', province: 'Malanje', type: 'municipio', lat: -8.0333, lng: 16.3000, zoom: 14, description: 'Norte de Malanje: amendoim, arroz, mandioca e feijão' },
  { name: 'Caculama (Mucari)', province: 'Malanje', type: 'municipio', lat: -9.5500, lng: 16.8500, zoom: 14, description: 'Grande polo produtor de mandioca de alta escala e cereais' },
  { name: 'Kiwaba Nzoji', province: 'Malanje', type: 'municipio', lat: -9.0000, lng: 16.6667, zoom: 14, description: 'Milho, feijão frade e agricultura tradicional' },
  { name: 'Marimba', province: 'Malanje', type: 'municipio', lat: -8.3667, lng: 17.0167, zoom: 14, description: 'Norte florestal de Malanje, recursos madeireiros e mandioca' },
  { name: 'Quirima', province: 'Malanje', type: 'municipio', lat: -10.5167, lng: 17.9667, zoom: 14, description: 'Sul de Malanje: bacia do Rio Cuango e arroz' },
  { name: 'Luquembo', province: 'Malanje', type: 'municipio', lat: -10.8667, lng: 17.5000, zoom: 14, description: 'Bacia do Alto Kwanza, cereais e pesca fluvial' },
  { name: 'Cambundi-Catembo', province: 'Malanje', type: 'municipio', lat: -10.1833, lng: 17.5333, zoom: 14, description: 'Cereais, pecuária extensiva e soja' },
  { name: 'Cunda-Dia-Baze', province: 'Malanje', type: 'municipio', lat: -8.6000, lng: 17.2500, zoom: 14, description: 'Baixa de Cassanje norte, mandioca e arroz' },
  { name: 'Caombo (Cahombo)', province: 'Malanje', type: 'municipio', lat: -8.8500, lng: 16.6000, zoom: 14, description: 'Agricultura tradicional de grãos e tubérculos' },
  { name: 'Lombe', province: 'Malanje', type: 'comuna', lat: -9.4833, lng: 16.1167, zoom: 14, description: 'Vale do Rio Lombe, horticultura irrigada e milho' },

  // ==========================================
  // 2. ÍCOLO E BENGO (NOVA PROVÍNCIA - DPA 2025)
  // ==========================================
  { name: 'Catete (Capital)', province: 'Ícolo e Bengo', type: 'capital', lat: -9.1167, lng: 13.7000, zoom: 14, description: 'Capital da Nova Província de Ícolo e Bengo. Projetos agropecuários, mandioca e cereais', isNewDPA: true },
  { name: 'Calumbo', province: 'Ícolo e Bengo', type: 'municipio', lat: -8.9833, lng: 13.4833, zoom: 14, description: 'Novo Município de Calumbo. Cinturão verde do Rio Kwanza: horticultura intensiva, tomate e cebola', isNewDPA: true },
  { name: 'Bom Jesus do Kwanza', province: 'Ícolo e Bengo', type: 'municipio', lat: -9.1667, lng: 13.5667, zoom: 14, description: 'Novo Município de Bom Jesus. Polo agroindustrial: cana-de-açúcar, avicultura e água mineral', isNewDPA: true },
  { name: 'Barra do Kwanza', province: 'Ícolo e Bengo', type: 'municipio', lat: -9.3167, lng: 13.1667, zoom: 14, description: 'Novo Município da Barra do Kwanza. Foz do Rio Kwanza, agricultura ribeirinha e pesca', isNewDPA: true },
  { name: 'Quiçama (Muxima)', province: 'Ícolo e Bengo', type: 'municipio', lat: -9.5167, lng: 13.9500, zoom: 14, description: 'Bacia do Rio Kwanza, mandioca, mel silvestre e frutas tropicais', isNewDPA: true },
  { name: 'Cabo Ledo', province: 'Ícolo e Bengo', type: 'municipio', lat: -9.6667, lng: 13.2000, zoom: 14, description: 'Novo Município de Cabo Ledo. Litoral sul, agroecologia e turismo costeiro', isNewDPA: true },
  { name: 'Cabiri', province: 'Ícolo e Bengo', type: 'municipio', lat: -9.0167, lng: 13.6833, zoom: 14, description: 'Novo Município de Cabiri. Lagoa do Cabiri: horticultura irrigada e aquicultura', isNewDPA: true },
  { name: 'Cassoneca', province: 'Ícolo e Bengo', type: 'municipio', lat: -9.1500, lng: 13.8500, zoom: 14, description: 'Agricultura tradicional de tubérculos e mandioca', isNewDPA: true },
  { name: 'Sequele', province: 'Ícolo e Bengo', type: 'municipio', lat: -8.8500, lng: 13.5000, zoom: 14, description: 'Novo Município de Sequele. Polo urbano-agrícola', isNewDPA: true },

  // ==========================================
  // 3. CUANDO (NOVA PROVÍNCIA - DPA 2025)
  // ==========================================
  { name: 'Mavinga (Capital)', province: 'Cuando', type: 'capital', lat: -15.7933, lng: 20.3667, zoom: 14, description: 'Capital da Nova Província do Cuando. Bacia do Rio Cuando, cereais e pastagens', isNewDPA: true },
  { name: 'Rivungo', province: 'Cuando', type: 'municipio', lat: -16.1833, lng: 22.4500, zoom: 14, description: 'Fronteira com a Zâmbia, bacia fluvial do Cuando e pesca', isNewDPA: true },
  { name: 'Dirico', province: 'Cuando', type: 'municipio', lat: -17.9667, lng: 20.7833, zoom: 14, description: 'Confluência dos rios Cuito e Cubango, agricultura irrigada', isNewDPA: true },
  { name: 'Calai', province: 'Cuando', type: 'municipio', lat: -17.8833, lng: 19.7667, zoom: 14, description: 'Margem do Rio Okavango, agricultura de aluvião', isNewDPA: true },
  { name: 'Cuangar', province: 'Cuando', type: 'municipio', lat: -17.6167, lng: 18.6167, zoom: 14, description: 'Fronteira da Namíbia, pecuária e cereais de sequeiro', isNewDPA: true },
  { name: 'Luengue', province: 'Cuando', type: 'municipio', lat: -16.5000, lng: 20.8000, zoom: 14, description: 'Território da Nova Província do Cuando, apicultura e cereais', isNewDPA: true },
  { name: 'Nancova', province: 'Cuando', type: 'municipio', lat: -16.1833, lng: 19.5333, zoom: 14, description: 'Região de savana, pecuária e mel', isNewDPA: true },
  { name: 'Mucusso', province: 'Cuando', type: 'comuna', lat: -18.0167, lng: 21.4333, zoom: 14, description: 'Faixa ribeirinha fértil fronteiriça da Namíbia', isNewDPA: true },
  { name: 'Luiana', province: 'Cuando', type: 'comuna', lat: -17.3333, lng: 23.0000, zoom: 14, description: 'Área do Parque Nacional Luengue-Luiana e recursos florestais', isNewDPA: true },

  // ==========================================
  // 4. CUBANGO (PROVÍNCIA DA NOVA DPA 2025)
  // ==========================================
  { name: 'Menongue (Capital)', province: 'Cubango', type: 'capital', lat: -14.6591, lng: 17.6908, zoom: 14, description: 'Capital da Província do Cubango. Vales fluviais, cereais e madeira', isNewDPA: true },
  { name: 'Cuito Cuanavale', province: 'Cubango', type: 'municipio', lat: -15.1667, lng: 19.1667, zoom: 14, description: 'Vales dos rios Cuito e Cuanavale, arroz e milho', isNewDPA: true },
  { name: 'Cuchi', province: 'Cubango', type: 'municipio', lat: -14.6500, lng: 16.9000, zoom: 14, description: 'Polo siderúrgico e agropecuário do Cubango', isNewDPA: true },
  { name: 'Caiundo', province: 'Cubango', type: 'municipio', lat: -15.7000, lng: 17.5500, zoom: 14, description: 'Margem do Rio Cubango, pastagens e cereais', isNewDPA: true },
  { name: 'Savate', province: 'Cubango', type: 'municipio', lat: -16.8500, lng: 17.9500, zoom: 14, description: 'Zona agrícola ribeirinha e pecuária', isNewDPA: true },
  { name: 'Cutato', province: 'Cubango', type: 'comuna', lat: -14.3500, lng: 16.5000, zoom: 14, description: 'Fronteira com o Huambo e Bié, batata e milho', isNewDPA: true },
  { name: 'Missombo', province: 'Cubango', type: 'comuna', lat: -14.7833, lng: 17.7667, zoom: 14, description: 'Centro de investigação agroflorestal', isNewDPA: true },

  // ==========================================
  // 5. MOXICO LESTE (NOVA PROVÍNCIA - DPA 2025)
  // ==========================================
  { name: 'Cazombo (Capital / Alto Zambeze)', province: 'Moxico Leste', type: 'capital', lat: -11.8900, lng: 22.9100, zoom: 14, description: 'Capital da Nova Província do Moxico Leste. Bacia do Alto Zambeze, arroz, mandioca e peixe', isNewDPA: true },
  { name: 'Luau', province: 'Moxico Leste', type: 'polo_agricola', lat: -10.7000, lng: 22.2333, zoom: 14, description: 'Terminal do Corredor do Lobito / Porto Seco na fronteira da RDC, grande polo logístico e agrícola', isNewDPA: true },
  { name: 'Luacano', province: 'Moxico Leste', type: 'municipio', lat: -11.2167, lng: 21.6500, zoom: 14, description: 'Lago Dilolo: maior lago natural de Angola, recursos aquícolas e arroz', isNewDPA: true },
  { name: 'Macondo', province: 'Moxico Leste', type: 'municipio', lat: -12.4500, lng: 23.3500, zoom: 14, description: 'Fronteira com a Zâmbia, bacia fluvial do Zambeze', isNewDPA: true },
  { name: 'Caianda', province: 'Moxico Leste', type: 'municipio', lat: -11.0500, lng: 23.5167, zoom: 14, description: 'Tríplice fronteira Angola-RDC-Zâmbia, comércio agropecuário', isNewDPA: true },
  { name: 'Lago Dilolo', province: 'Moxico Leste', type: 'polo_agricola', lat: -11.5167, lng: 22.0167, zoom: 14, description: 'Lago natural, turismo e agricultura de várzea', isNewDPA: true },
  { name: 'Nana Candundo', province: 'Moxico Leste', type: 'comuna', lat: -11.5000, lng: 23.1000, zoom: 14, description: 'Comuna do Alto Zambeze, mandioca e arroz', isNewDPA: true },
  { name: 'Lumbala Caquengue', province: 'Moxico Leste', type: 'comuna', lat: -12.1833, lng: 22.8167, zoom: 14, description: 'Margem do Rio Zambeze', isNewDPA: true },

  // ==========================================
  // 6. BENGO
  // ==========================================
  { name: 'Caxito (Dande)', province: 'Bengo', type: 'capital', lat: -8.5811, lng: 13.6644, zoom: 14, description: 'Capital do Bengo. Vale do Dande: polo de banana de mesa, manga e horticultura' },
  { name: 'Ambriz', province: 'Bengo', type: 'municipio', lat: -7.8500, lng: 13.1167, zoom: 14, description: 'Litoral norte do Bengo, agropecuária e pesca' },
  { name: 'Bula Atumba', province: 'Bengo', type: 'municipio', lat: -8.4167, lng: 14.3833, zoom: 14, description: 'Região montanhosa, café robusta e banana' },
  { name: 'Dembos (Quibaxe)', province: 'Bengo', type: 'municipio', lat: -8.5000, lng: 14.5833, zoom: 14, description: 'Tradicional zona florestal e cafeeira' },
  { name: 'Nambuangongo', province: 'Bengo', type: 'municipio', lat: -8.1833, lng: 14.3667, zoom: 14, description: 'Planalto fértil, mandioca e palmeira de dendém' },
  { name: 'Pango Aluquém', province: 'Bengo', type: 'municipio', lat: -8.4500, lng: 14.4500, zoom: 14, description: 'Cultivo de café, citrinos e mandioca' },
  { name: 'Úcua', province: 'Bengo', type: 'municipio', lat: -8.6833, lng: 13.9167, zoom: 14, description: 'Novo município do Bengo, cafeicultura e banana', isNewDPA: true },
  { name: 'Piri', province: 'Bengo', type: 'municipio', lat: -8.4167, lng: 14.7333, zoom: 14, description: 'Novo município na zona dos Dembos', isNewDPA: true },

  // ==========================================
  // 7. BENGUELA
  // ==========================================
  { name: 'Benguela (Capital)', province: 'Benguela', type: 'capital', lat: -12.5763, lng: 13.4055, zoom: 14, description: 'Capital costeira, cinturão hortícola e logístico' },
  { name: 'Dombe Grande', province: 'Benguela', type: 'polo_agricola', lat: -12.9500, lng: 13.1167, zoom: 14, description: 'Polo Irrigado do Dombe Grande: maior produtor de banana, tomate, manga e cebola' },
  { name: 'Ganda', province: 'Benguela', type: 'municipio', lat: -13.0333, lng: 14.6333, zoom: 14, description: 'Grande polo produtor de milho, feijão, trigo e café' },
  { name: 'Cubal', province: 'Benguela', type: 'municipio', lat: -13.0333, lng: 14.2500, zoom: 14, description: 'Sisal, cereais e pecuária de corte' },
  { name: 'Lobito', province: 'Benguela', type: 'municipio', lat: -12.3500, lng: 13.5500, zoom: 14, description: 'Polo portuário e horticultura periurbana' },
  { name: 'Catumbela', province: 'Benguela', type: 'municipio', lat: -12.4333, lng: 13.5500, zoom: 14, description: 'Bacia irrigada do Rio Catumbela, cana e banana' },
  { name: 'Caimbambo', province: 'Benguela', type: 'municipio', lat: -13.0333, lng: 13.9833, zoom: 14, description: 'Agropecuária de transição e cereais' },
  { name: 'Chongoroi', province: 'Benguela', type: 'municipio', lat: -13.6167, lng: 13.9500, zoom: 14, description: 'Zona cerealífera de sequeiro (sorgo e milho) e gado' },
  { name: 'Balombo', province: 'Benguela', type: 'municipio', lat: -12.3667, lng: 14.7667, zoom: 14, description: 'Terras altas férteis, milho e café' },
  { name: 'Bocoio', province: 'Benguela', type: 'municipio', lat: -12.4667, lng: 14.1333, zoom: 14, description: 'Mandioca, feijão e fruticultura tropical' },
  { name: 'Baía Farta', province: 'Benguela', type: 'municipio', lat: -12.6000, lng: 13.2000, zoom: 14, description: 'Polo pesqueiro, salinas e agricultura costeira' },
  { name: 'Babaera', province: 'Benguela', type: 'municipio', lat: -13.1500, lng: 14.8500, zoom: 14, description: 'Novo município de Benguela, cereais e café', isNewDPA: true },
  { name: 'Canjala', province: 'Benguela', type: 'municipio', lat: -11.9667, lng: 13.9500, zoom: 14, description: 'Novo município do litoral norte de Benguela', isNewDPA: true },

  // ==========================================
  // 8. BIÉ
  // ==========================================
  { name: 'Cuíto (Capital)', province: 'Bié', type: 'capital', lat: -12.3833, lng: 16.9333, zoom: 14, description: 'Capital do Bié. Centro cerealífero, batata e milho' },
  { name: 'Andulo', province: 'Bié', type: 'municipio', lat: -11.2500, lng: 16.6667, zoom: 14, description: 'Grande polo agropecuário e cafeeiro do norte do Bié' },
  { name: 'Camacupa', province: 'Bié', type: 'municipio', lat: -12.0167, lng: 17.4833, zoom: 14, description: 'Centro geodésico de Angola, bacia arrozeira e milho' },
  { name: 'Catabola', province: 'Bié', type: 'municipio', lat: -12.1500, lng: 17.2833, zoom: 14, description: 'Produção intensiva de cereais e leguminosas' },
  { name: 'Chinguar', province: 'Bié', type: 'municipio', lat: -12.5833, lng: 16.3500, zoom: 14, description: 'Fronteira com Huambo, batata-rena e milho' },
  { name: 'Nhârea', province: 'Bié', type: 'municipio', lat: -11.4833, lng: 16.9667, zoom: 14, description: 'Solos férteis para arroz, mandioca e feijão' },
  { name: 'Chitembo', province: 'Bié', type: 'municipio', lat: -13.5167, lng: 16.7500, zoom: 14, description: 'Sul do Bié, cereais e pastagens' },
  { name: 'Cunhinga', province: 'Bié', type: 'municipio', lat: -11.8500, lng: 16.7333, zoom: 14, description: 'Produção agrícola familiar e hortícolas' },
  { name: 'Cuemba', province: 'Bié', type: 'municipio', lat: -12.1500, lng: 18.0833, zoom: 14, description: 'Leste do Bié, bacia do Rio Cuango e arroz' },
  { name: 'Calucinga', province: 'Bié', type: 'municipio', lat: -11.1667, lng: 16.4167, zoom: 14, description: 'Novo município do Andulo, café e cereais', isNewDPA: true },
  { name: 'Belo Horizonte', province: 'Bié', type: 'municipio', lat: -12.1833, lng: 16.7500, zoom: 14, description: 'Novo município cerealífero do Bié', isNewDPA: true },

  // ==========================================
  // 9. CABINDA
  // ==========================================
  { name: 'Cabinda (Capital)', province: 'Cabinda', type: 'capital', lat: -5.5567, lng: 12.1974, zoom: 14, description: 'Capital de Cabinda. Florestal, cacau, café e banana' },
  { name: 'Cacongo (Landana)', province: 'Cabinda', type: 'municipio', lat: -5.2333, lng: 12.1333, zoom: 14, description: 'Palmeira de dendém, mandioca e horticultura' },
  { name: 'Buco Zau', province: 'Cabinda', type: 'municipio', lat: -4.9500, lng: 12.5667, zoom: 14, description: 'Floresta do Maiombe: cacau, borracha e café robusta' },
  { name: 'Belize', province: 'Cabinda', type: 'municipio', lat: -4.6333, lng: 12.8000, zoom: 14, description: 'Coração do Maiombe, agricultura tropical e madeira' },
  { name: 'Necuto', province: 'Cabinda', type: 'comuna', lat: -4.8500, lng: 12.7000, zoom: 14, description: 'Comuna agrícola de alta pluviosidade' },
  { name: 'Miconje', province: 'Cabinda', type: 'comuna', lat: -4.5167, lng: 12.8833, zoom: 14, description: 'Fronteira norte florestal do Maiombe' },

  // ==========================================
  // 10. CUANZA NORTE
  // ==========================================
  { name: 'Ndalatando (Cazengo)', province: 'Cuanza Norte', type: 'capital', lat: -9.3000, lng: 14.9167, zoom: 14, description: 'Capital do Cuanza Norte. Café robusta, banana e hortícolas' },
  { name: 'Ambaca (Camabatela)', province: 'Cuanza Norte', type: 'polo_agricola', lat: -8.1833, lng: 15.3667, zoom: 14, description: 'Planalto de Camabatela: maior polo pecuário e pastagens naturais de Angola' },
  { name: 'Cambambe (Dondo)', province: 'Cuanza Norte', type: 'municipio', lat: -9.6833, lng: 14.4333, zoom: 14, description: 'Vale do Médio Kwanza e fruticultura' },
  { name: 'Golungo Alto', province: 'Cuanza Norte', type: 'municipio', lat: -9.1333, lng: 14.7667, zoom: 14, description: 'Tradição secular cafeeira, citrinos e banana' },
  { name: 'Lucala', province: 'Cuanza Norte', type: 'municipio', lat: -9.2667, lng: 15.2333, zoom: 14, description: 'Bacia agropecuária e cruzamento rodoviário de grãos' },
  { name: 'Samba Caju', province: 'Cuanza Norte', type: 'municipio', lat: -8.8667, lng: 15.4000, zoom: 14, description: 'Zona de cereais e pecuária' },
  { name: 'Banga', province: 'Cuanza Norte', type: 'municipio', lat: -8.7500, lng: 14.9667, zoom: 14, description: 'Café, mandioca e milho' },
  { name: 'Bolongongo', province: 'Cuanza Norte', type: 'municipio', lat: -8.6667, lng: 15.2000, zoom: 14, description: 'Cultivo florestal e cafeeiro' },
  { name: 'Quiculungo', province: 'Cuanza Norte', type: 'municipio', lat: -8.5167, lng: 15.3167, zoom: 14, description: 'Café e agricultura de subsistência' },
  { name: 'Ngonguembo (Quilombo dos Dembos)', province: 'Cuanza Norte', type: 'municipio', lat: -9.3833, lng: 14.4500, zoom: 14, description: 'Palmeira de dendém e café' },
  { name: 'Massangano', province: 'Cuanza Norte', type: 'municipio', lat: -9.6167, lng: 14.2500, zoom: 14, description: 'Novo município na confluência do Kwanza e Lucala', isNewDPA: true },

  // ==========================================
  // 11. CUANZA SUL
  // ==========================================
  { name: 'Sumbe (Capital)', province: 'Cuanza Sul', type: 'capital', lat: -11.2061, lng: 13.8437, zoom: 14, description: 'Capital do Cuanza Sul. Litoral e horticultura irrigada' },
  { name: 'Cela / Waku Kungo', province: 'Cuanza Sul', type: 'polo_agricola', lat: -11.4167, lng: 15.1167, zoom: 14, description: 'Vale do Waku Kungo: principal bacia leiteira, milho, soja e trigo de Angola' },
  { name: 'Calulo (Libolo)', province: 'Cuanza Sul', type: 'municipio', lat: -10.0000, lng: 14.9000, zoom: 14, description: 'Maior produtor de café robusta e arábica, milho e abacaxi' },
  { name: 'Amboim (Gabela)', province: 'Cuanza Sul', type: 'municipio', lat: -10.7333, lng: 14.3667, zoom: 14, description: 'Berço do afamado Café Gabela e palmeira de dendém' },
  { name: 'Porto Amboim', province: 'Cuanza Sul', type: 'municipio', lat: -10.7333, lng: 13.7667, zoom: 14, description: 'Costa e foz do Rio Queve' },
  { name: 'Quibala', province: 'Cuanza Sul', type: 'municipio', lat: -10.7333, lng: 14.9833, zoom: 14, description: 'Corredor agroindustrial de cereais e feijão' },
  { name: 'Seles (Ucu Seles)', province: 'Cuanza Sul', type: 'municipio', lat: -11.4000, lng: 14.3000, zoom: 14, description: 'Café, banana e hortícolas de montanha' },
  { name: 'Cassongue', province: 'Cuanza Sul', type: 'municipio', lat: -11.8833, lng: 15.0333, zoom: 14, description: 'Terras altas férteis, batata-rena e trigo' },
  { name: 'Mussende', province: 'Cuanza Sul', type: 'municipio', lat: -10.5167, lng: 16.0167, zoom: 14, description: 'Grandes extensões para grãos e pecuária comercial' },
  { name: 'Conda', province: 'Cuanza Sul', type: 'municipio', lat: -11.1167, lng: 14.3333, zoom: 14, description: 'Águas termais e cultivo de café' },
  { name: 'Ebo', province: 'Cuanza Sul', type: 'municipio', lat: -11.0167, lng: 14.7000, zoom: 14, description: 'Milho, feijão e horticultura' },
  { name: 'Quilenda', province: 'Cuanza Sul', type: 'municipio', lat: -10.4500, lng: 14.0500, zoom: 14, description: 'Algodão e mandioca' },
  { name: 'Quissonde', province: 'Cuanza Sul', type: 'municipio', lat: -10.2000, lng: 15.2000, zoom: 14, description: 'Novo município do Libolo, agricultura de cereais', isNewDPA: true },

  // ==========================================
  // 12. CUNENE
  // ==========================================
  { name: 'Ondjiva (Cuanhama)', province: 'Cunene', type: 'capital', lat: -17.0667, lng: 15.7333, zoom: 14, description: 'Capital do Cunene. Pecuária de corte bovina, massambala e massango' },
  { name: 'Ombadja (Xangongo)', province: 'Cunene', type: 'municipio', lat: -16.7500, lng: 14.9833, zoom: 14, description: 'Perímetro do Rio Cunene, projetos de irrigação e gado' },
  { name: 'Cahama', province: 'Cunene', type: 'municipio', lat: -16.2833, lng: 14.3167, zoom: 14, description: 'Grandes fazendas agropecuárias e criação de bovinos' },
  { name: 'Namacunde', province: 'Cunene', type: 'municipio', lat: -17.3000, lng: 15.8667, zoom: 14, description: 'Fronteira com Santa Clara / Namíbia, agricultura resistente à seca' },
  { name: 'Curoca', province: 'Cunene', type: 'municipio', lat: -16.4667, lng: 13.9167, zoom: 14, description: 'Bacia do Rio Curoca e caprinocultura' },
  { name: 'Cuvelai', province: 'Cunene', type: 'municipio', lat: -15.6500, lng: 16.1667, zoom: 14, description: 'Norte do Cunene, pastagens e milho' },
  { name: 'Santa Clara', province: 'Cunene', type: 'polo_agricola', lat: -17.3833, lng: 15.9333, zoom: 14, description: 'Polo logístico e comercial transfronteiriço' },
  { name: 'Humbe', province: 'Cunene', type: 'municipio', lat: -16.6833, lng: 14.9000, zoom: 14, description: 'Novo município de Ombadja, bacia do Rio Cunene', isNewDPA: true },

  // ==========================================
  // 13. HUAMBO
  // ==========================================
  { name: 'Huambo (Capital)', province: 'Huambo', type: 'capital', lat: -12.7761, lng: 15.7392, zoom: 14, description: 'Capital do Huambo. Planalto Central, sementes, cereais e hortícolas' },
  { name: 'Caála', province: 'Huambo', type: 'municipio', lat: -12.8525, lng: 15.5606, zoom: 14, description: 'Grande polo produtor de milho, feijão manteiga, batata-rena e trigo' },
  { name: 'Bailundo', province: 'Huambo', type: 'municipio', lat: -12.1950, lng: 15.8683, zoom: 14, description: 'Centro histórico agrícola: milho, trigo, hortícolas e café arábica' },
  { name: 'Ekunha', province: 'Huambo', type: 'municipio', lat: -12.6739, lng: 15.5128, zoom: 14, description: 'Terras férteis para tubérculos, repolho e feijão' },
  { name: 'Longonjo', province: 'Huambo', type: 'municipio', lat: -12.9083, lng: 15.2500, zoom: 14, description: 'Zona agropecuária, cereais e pecuária' },
  { name: 'Chicala Cholohanga', province: 'Huambo', type: 'municipio', lat: -12.8733, lng: 16.0381, zoom: 14, description: 'Região de nascentes fluviais, milho e feijão' },
  { name: 'Cachiungo', province: 'Huambo', type: 'municipio', lat: -12.7500, lng: 16.2333, zoom: 14, description: 'Produção agrícola comercial e cooperativas' },
  { name: 'Londuimbali', province: 'Huambo', type: 'municipio', lat: -12.2500, lng: 15.3167, zoom: 14, description: 'Noroeste do Huambo, café, milho e hortaliças' },
  { name: 'Mungo', province: 'Huambo', type: 'municipio', lat: -11.8333, lng: 16.1667, zoom: 14, description: 'Norte do Huambo, mandioca, milho e cereais' },
  { name: 'Ucuma', province: 'Huambo', type: 'municipio', lat: -12.8500, lng: 15.0667, zoom: 14, description: 'Vale agrícola, fruticultura e horticultura' },
  { name: 'Chinjenje', province: 'Huambo', type: 'municipio', lat: -12.6833, lng: 14.9333, zoom: 14, description: 'Transição agro-ecológica Huambo-Benguela' },
  { name: 'Calenga', province: 'Huambo', type: 'polo_agricola', lat: -12.9167, lng: 15.4500, zoom: 14, description: 'Polo hortícola da Caála: maior produtor de repolho, cenoura e cebola', isNewDPA: true },
  { name: 'Cuima', province: 'Huambo', type: 'municipio', lat: -13.2333, lng: 15.6500, zoom: 14, description: 'Novo município do sul do Huambo, cereais e madeira', isNewDPA: true },

  // ==========================================
  // 14. HUÍLA
  // ==========================================
  { name: 'Lubango (Capital)', province: 'Huíla', type: 'capital', lat: -14.9172, lng: 13.5456, zoom: 14, description: 'Capital da Huíla. Vale do Lubango: horticultura intensiva, floricultura e fruticultura' },
  { name: 'Humpata', province: 'Huíla', type: 'municipio', lat: -15.0167, lng: 13.3667, zoom: 14, description: 'Polo de batata-rena, maçã, pêssego, morango, hortaliças e laticínios' },
  { name: 'Matala', province: 'Huíla', type: 'polo_agricola', lat: -15.6833, lng: 15.0333, zoom: 14, description: 'Perímetro Irrigado da Matala: principal produtor de tomate, milho, arroz e feijão' },
  { name: 'Chibia', province: 'Huíla', type: 'municipio', lat: -15.1833, lng: 13.7000, zoom: 14, description: 'Produção agrícola tradicional, hortaliças e pecuária bovina' },
  { name: 'Quilengues', province: 'Huíla', type: 'municipio', lat: -14.0833, lng: 14.0833, zoom: 14, description: 'Grande bacia de cereais (milho, massambala) e gado' },
  { name: 'Caconda', province: 'Huíla', type: 'municipio', lat: -13.7333, lng: 15.0667, zoom: 14, description: 'Grande celeiro histórico de milho, feijão e batata do norte da Huíla' },
  { name: 'Caluquembe', province: 'Huíla', type: 'municipio', lat: -13.7833, lng: 14.6833, zoom: 14, description: 'Fértil planalto norte da Huíla, milho e feijão' },
  { name: 'Quipungo', province: 'Huíla', type: 'municipio', lat: -14.8167, lng: 14.5500, zoom: 14, description: 'Bacia agropecuária e cereais' },
  { name: 'Chicomba', province: 'Huíla', type: 'municipio', lat: -14.1667, lng: 14.9667, zoom: 14, description: 'Agricultura de sequeiro e cereais' },
  { name: 'Jamba', province: 'Huíla', type: 'municipio', lat: -14.7000, lng: 16.0667, zoom: 14, description: 'Leste da Huíla, mineração e pecuária' },
  { name: 'Chipindo', province: 'Huíla', type: 'municipio', lat: -13.8333, lng: 15.8000, zoom: 14, description: 'Terras altas, milho e recursos florestais' },
  { name: 'Cuvango', province: 'Huíla', type: 'municipio', lat: -14.4667, lng: 16.3000, zoom: 14, description: 'Bacia do Rio Cubango, arroz e cereais' },
  { name: 'Gambos (Chiange)', province: 'Huíla', type: 'municipio', lat: -15.7500, lng: 14.0833, zoom: 14, description: 'Pecuária bovina e agricultura resistente' },
  { name: 'Cacula', province: 'Huíla', type: 'municipio', lat: -14.5167, lng: 14.1667, zoom: 14, description: 'Zona cerealífera e feijão' },
  { name: 'Capenda Camulemba', province: 'Huíla', type: 'municipio', lat: -15.2000, lng: 14.8000, zoom: 14, description: 'Novo município do centro da Huíla', isNewDPA: true },

  // ==========================================
  // 15. LUANDA (16 MUNICÍPIOS METROPOLITANOS)
  // ==========================================
  { name: 'Luanda (Ingombota)', province: 'Luanda', type: 'capital', lat: -8.8383, lng: 13.2344, zoom: 13, description: 'Capital de Angola e sede da Província de Luanda' },
  { name: 'Viana', province: 'Luanda', type: 'municipio', lat: -8.9000, lng: 13.3667, zoom: 14, description: 'Polo industrial, horticultura periurbana e logística' },
  { name: 'Belas', province: 'Luanda', type: 'municipio', lat: -8.9900, lng: 13.2500, zoom: 14, description: 'Zona sul metropolitana e cinturão hortícola' },
  { name: 'Talatona', province: 'Luanda', type: 'municipio', lat: -8.9200, lng: 13.1800, zoom: 14, description: 'Centro comercial e projetos hidropónicos' },
  { name: 'Cazenga', province: 'Luanda', type: 'municipio', lat: -8.8200, lng: 13.2900, zoom: 14, description: 'Zona urbana de processamento agroalimentar' },
  { name: 'Cacuaco', province: 'Luanda', type: 'municipio', lat: -8.7833, lng: 13.3667, zoom: 14, description: 'Horticultura periurbana e salinas' },
  { name: 'Kilamba', province: 'Luanda', type: 'municipio', lat: -8.9950, lng: 13.2700, zoom: 14, description: 'Novo município da centralidade do Kilamba', isNewDPA: true },
  { name: 'Kilamba Kiaxi', province: 'Luanda', type: 'municipio', lat: -8.8700, lng: 13.2600, zoom: 14, description: 'Município urbano de Luanda' },
  { name: 'Camama', province: 'Luanda', type: 'municipio', lat: -8.9100, lng: 13.2400, zoom: 14, description: 'Novo município metropolitano de Camama', isNewDPA: true },
  { name: 'Mulenvos', province: 'Luanda', type: 'municipio', lat: -8.8700, lng: 13.3400, zoom: 14, description: 'Novo município de Mulenvos de Baixo/Cima', isNewDPA: true },
  { name: 'Mussulo', province: 'Luanda', type: 'municipio', lat: -8.9600, lng: 13.1200, zoom: 14, description: 'Novo município da Península do Mussulo, pesca e aquicultura', isNewDPA: true },
  { name: 'Maianga', province: 'Luanda', type: 'municipio', lat: -8.8350, lng: 13.2250, zoom: 14, description: 'Centro metropolitano de Luanda' },
  { name: 'Rangel', province: 'Luanda', type: 'municipio', lat: -8.8250, lng: 13.2550, zoom: 14, description: 'Novo município do Rangel', isNewDPA: true },
  { name: 'Samba', province: 'Luanda', type: 'municipio', lat: -8.8500, lng: 13.2100, zoom: 14, description: 'Novo município costeiro da Samba', isNewDPA: true },
  { name: 'Sambizanga', province: 'Luanda', type: 'municipio', lat: -8.8050, lng: 13.2450, zoom: 14, description: 'Zona urbana costeira' },
  { name: 'Hoji-ya-Henda', province: 'Luanda', type: 'municipio', lat: -8.8100, lng: 13.2700, zoom: 14, description: 'Novo município metropolitano', isNewDPA: true },

  // ==========================================
  // 16. LUNDA NORTE
  // ==========================================
  { name: 'Dundo (Chitato)', province: 'Lunda Norte', type: 'capital', lat: -7.3833, lng: 20.8333, zoom: 14, description: 'Capital da Lunda Norte. Mandioca, arroz e hortícolas' },
  { name: 'Lucapa', province: 'Lunda Norte', type: 'municipio', lat: -8.4167, lng: 20.7500, zoom: 14, description: 'Bacia hidrográfica fértil do Rio Chicapa' },
  { name: 'Cuango', province: 'Lunda Norte', type: 'municipio', lat: -9.1500, lng: 18.0500, zoom: 14, description: 'Vale do Rio Cuango, mandioca e agricultura fluvial' },
  { name: 'Capenda Camulemba', province: 'Lunda Norte', type: 'municipio', lat: -9.4167, lng: 18.4333, zoom: 14, description: 'Cereais, milho e mandioca' },
  { name: 'Cambulo', province: 'Lunda Norte', type: 'municipio', lat: -7.8667, lng: 21.4167, zoom: 14, description: 'Fronteira com RDC, agricultura tropical' },
  { name: 'Caungula', province: 'Lunda Norte', type: 'municipio', lat: -8.0833, lng: 19.0000, zoom: 14, description: 'Arroz de sequeiro e mandioca' },
  { name: 'Cuílo', province: 'Lunda Norte', type: 'municipio', lat: -8.0000, lng: 19.5333, zoom: 14, description: 'Bacia do Rio Cuílo e pesca' },
  { name: 'Lubalo', province: 'Lunda Norte', type: 'municipio', lat: -8.9667, lng: 19.2333, zoom: 14, description: 'Mandioca e amendoim' },
  { name: 'Xá-Muteba', province: 'Lunda Norte', type: 'municipio', lat: -9.5167, lng: 17.8167, zoom: 14, description: 'Fronteira com Malanje, milho e mandioca' },
  { name: 'Lóvua', province: 'Lunda Norte', type: 'municipio', lat: -7.6667, lng: 20.2500, zoom: 14, description: 'Novo município da Lunda Norte, agricultura tropical', isNewDPA: true },

  // ==========================================
  // 17. LUNDA SUL
  // ==========================================
  { name: 'Saurimo (Capital)', province: 'Lunda Sul', type: 'capital', lat: -9.6608, lng: 20.3916, zoom: 14, description: 'Capital da Lunda Sul. Planalto de Saurimo: mandioca, milho, hortaliças e mel' },
  { name: 'Muconda', province: 'Lunda Sul', type: 'municipio', lat: -10.6000, lng: 21.3333, zoom: 14, description: 'Agricultura tradicional, feijão e apicultura' },
  { name: 'Cacolo', province: 'Lunda Sul', type: 'municipio', lat: -10.1167, lng: 19.3167, zoom: 14, description: 'Fronteira com Malanje, cereais e pastagens' },
  { name: 'Dala', province: 'Lunda Sul', type: 'municipio', lat: -11.0333, lng: 20.2000, zoom: 14, description: 'Quedas do Rio Chiumbe, arroz e mandioca' },
  { name: 'Mona Quimbundo', province: 'Lunda Sul', type: 'municipio', lat: -9.8500, lng: 20.5500, zoom: 14, description: 'Novo município, polo de alta produção de tubérculos', isNewDPA: true },
  { name: 'Alto Chicapa', province: 'Lunda Sul', type: 'municipio', lat: -10.3833, lng: 19.2500, zoom: 14, description: 'Novo município do Alto Chicapa', isNewDPA: true },

  // ==========================================
  // 18. MOXICO (CENTRAL / OESTE)
  // ==========================================
  { name: 'Luena (Capital)', province: 'Moxico', type: 'capital', lat: -11.7833, lng: 19.9167, zoom: 14, description: 'Capital da Província do Moxico. Mandioca, arroz de sequeiro e mel silvestre' },
  { name: 'Camanongue', province: 'Moxico', type: 'municipio', lat: -11.4500, lng: 20.1667, zoom: 14, description: 'Bacia de mandioca, milho e hortaliças' },
  { name: 'Léua', province: 'Moxico', type: 'municipio', lat: -11.6500, lng: 20.4500, zoom: 14, description: 'Corredor ferroviário do Lobito, agricultura florestal e apicultura' },
  { name: 'Cameia (Lumeje)', province: 'Moxico', type: 'municipio', lat: -11.6167, lng: 20.7833, zoom: 14, description: 'Parque da Cameia, lagoas férteis, arroz e pesca' },
  { name: 'Bundas (Lumbala Nguimbo)', province: 'Moxico', type: 'municipio', lat: -14.1000, lng: 20.0667, zoom: 14, description: 'Sul do Moxico, pastagens e apicultura' },
  { name: 'Luchazes (Capango)', province: 'Moxico', type: 'municipio', lat: -12.8000, lng: 19.7000, zoom: 14, description: 'Extenso território florestal e mel de abelha' },
  { name: 'Lucusse', province: 'Moxico', type: 'municipio', lat: -12.4500, lng: 20.3000, zoom: 14, description: 'Novo município do Moxico, bacia do Rio Lungué-Bungo', isNewDPA: true },
  { name: 'Cangamba', province: 'Moxico', type: 'municipio', lat: -13.7000, lng: 19.8667, zoom: 14, description: 'Novo município florestal dos Luchazes', isNewDPA: true },

  // ==========================================
  // 19. NAMIBE
  // ==========================================
  { name: 'Moçâmedes (Capital)', province: 'Namibe', type: 'capital', lat: -15.1961, lng: 12.1522, zoom: 14, description: 'Capital do Namibe. Litoral desértico e hortas irrigadas de oásis' },
  { name: 'Bibala', province: 'Namibe', type: 'polo_agricola', lat: -14.7667, lng: 13.3500, zoom: 14, description: 'Oásis agrícola da Bibala: grande produtor de tomate, cebola, alho, citrinos e manga' },
  { name: 'Virei', province: 'Namibe', type: 'municipio', lat: -15.6833, lng: 12.9667, zoom: 14, description: 'Pastagens pastoris e caprinocultura tradicional' },
  { name: 'Tômbwa', province: 'Namibe', type: 'municipio', lat: -15.8000, lng: 11.8333, zoom: 14, description: 'Deserto costeiro, pesca e primeiras plantações de oliveiras' },
  { name: 'Camucuio', province: 'Namibe', type: 'municipio', lat: -13.8500, lng: 12.9500, zoom: 14, description: 'Norte do Namibe, pecuária e agricultura de várzea' },
  { name: 'Lucira', province: 'Namibe', type: 'municipio', lat: -13.8667, lng: 12.5167, zoom: 14, description: 'Novo município do litoral norte do Namibe, pesca e agricultura', isNewDPA: true },
  { name: 'Iona', province: 'Namibe', type: 'municipio', lat: -16.7167, lng: 12.5833, zoom: 14, description: 'Parque Nacional de Iona e pastorícia tradicional', isNewDPA: true },

  // ==========================================
  // 20. UÍGE
  // ==========================================
  { name: 'Uíge (Capital)', province: 'Uíge', type: 'capital', lat: -7.6086, lng: 15.0613, zoom: 14, description: 'Capital do Uíge. Berço do Café Robusta e floresta tropical úmida' },
  { name: 'Negage', province: 'Uíge', type: 'polo_agricola', lat: -7.7667, lng: 15.2667, zoom: 14, description: 'Polo Agrícola de Negage: alta produção de café, banana, arroz de várzea, milho e mandioca' },
  { name: 'Songo', province: 'Uíge', type: 'municipio', lat: -7.3500, lng: 14.8667, zoom: 14, description: 'Café robusta de alta qualidade e citrinos' },
  { name: 'Damba', province: 'Uíge', type: 'municipio', lat: -6.6833, lng: 15.1500, zoom: 14, description: 'Planalto da Damba, gado bovino e tubérculos' },
  { name: 'Maquela do Zombo', province: 'Uíge', type: 'municipio', lat: -6.0500, lng: 15.1167, zoom: 14, description: 'Fronteira norte com a RDC, amendoim e mandioca' },
  { name: 'Sanza Pombo', province: 'Uíge', type: 'municipio', lat: -7.3167, lng: 15.9833, zoom: 14, description: 'Grandes bacias de arroz, mandioca e café' },
  { name: 'Puri', province: 'Uíge', type: 'municipio', lat: -7.6500, lng: 15.6000, zoom: 14, description: 'Café e banana' },
  { name: 'Bungo', province: 'Uíge', type: 'municipio', lat: -7.4333, lng: 15.3833, zoom: 14, description: 'Agricultura tropical e tubérculos' },
  { name: 'Ambuíla', province: 'Uíge', type: 'municipio', lat: -7.8667, lng: 14.7000, zoom: 14, description: 'Mandioca e café' },
  { name: 'Bembe', province: 'Uíge', type: 'municipio', lat: -7.1167, lng: 14.4333, zoom: 14, description: 'Café robusta e palmeira de dendém' },
  { name: 'Cangola (Alto Cauale)', province: 'Uíge', type: 'municipio', lat: -8.1000, lng: 15.8500, zoom: 14, description: 'Zona cafeeira do sul do Uíge' },
  { name: 'Mucaba', province: 'Uíge', type: 'municipio', lat: -7.1500, lng: 15.2667, zoom: 14, description: 'Mandioca, feijão e café' },
  { name: 'Milunga (Macocola)', province: 'Uíge', type: 'municipio', lat: -7.4167, lng: 16.7167, zoom: 14, description: 'Leste do Uíge, amendoim e arroz' },
  { name: 'Quimbele', province: 'Uíge', type: 'municipio', lat: -6.5167, lng: 16.2167, zoom: 14, description: 'Mandioca e comércio transfronteiriço' },
  { name: 'Quitexe', province: 'Uíge', type: 'municipio', lat: -8.2167, lng: 15.0500, zoom: 14, description: 'Café, madeira e banana' },
  { name: 'Santa Cruz (Pomfret)', province: 'Uíge', type: 'municipio', lat: -7.0333, lng: 16.0333, zoom: 14, description: 'Novo município do norte do Uíge', isNewDPA: true },
  { name: 'Buengas (Nova Esperança)', province: 'Uíge', type: 'municipio', lat: -7.0167, lng: 15.8667, zoom: 14, description: 'Novo município de Buengas, bacia do Rio Cuilo', isNewDPA: true },
  { name: 'Massau', province: 'Uíge', type: 'municipio', lat: -6.6500, lng: 16.6333, zoom: 14, description: 'Novo município fronteiriço de Massau', isNewDPA: true },

  // ==========================================
  // 21. ZAIRE
  // ==========================================
  { name: 'Mbanza Kongo (Capital)', province: 'Zaire', type: 'capital', lat: -6.2670, lng: 14.2417, zoom: 14, description: 'Capital do Zaire. Cidade Património Mundial: mandioca, amendoim e citrinos' },
  { name: 'Soyo', province: 'Zaire', type: 'municipio', lat: -6.1333, lng: 12.3667, zoom: 14, description: 'Foz do Rio Zaire, agricultura costeira e pesca' },
  { name: 'Nzeto', province: 'Zaire', type: 'municipio', lat: -7.2333, lng: 12.8667, zoom: 14, description: 'Litoral sul do Zaire, mandioca e pecuária' },
  { name: 'Tomboco', province: 'Zaire', type: 'municipio', lat: -6.8000, lng: 13.3000, zoom: 14, description: 'Centro do Zaire, transição florestal e agricultura' },
  { name: 'Nóqui', province: 'Zaire', type: 'municipio', lat: -5.8833, lng: 13.4333, zoom: 14, description: 'Margem do Rio Zaire na fronteira com Matadi (RDC)' },
  { name: 'Cuimba', province: 'Zaire', type: 'municipio', lat: -6.1167, lng: 14.9500, zoom: 14, description: 'Leste do Zaire, grande produtor de mandioca e amendoim' },
  { name: 'Pedra do Feitiço', province: 'Zaire', type: 'municipio', lat: -6.0167, lng: 12.8667, zoom: 14, description: 'Novo município do Rio Zaire', isNewDPA: true },
  { name: 'Lufico', province: 'Zaire', type: 'municipio', lat: -6.5500, lng: 13.9167, zoom: 14, description: 'Novo município de transição agroflorestal', isNewDPA: true },
];

/**
 * Pesquisa inteligente de localidades e províncias na Nova DPA de Angola
 */
export function searchAngolaLocations(query: string, filterProvince?: string): AngolaLocation[] {
  if (!query && !filterProvince) return ANGOLA_MUNICIPALITIES;

  const cleanQuery = (query || '').trim().toLowerCase();

  return ANGOLA_MUNICIPALITIES.filter((loc) => {
    const matchProvince = filterProvince
      ? loc.province.toLowerCase() === filterProvince.toLowerCase()
      : true;

    if (!matchProvince) return false;
    if (!cleanQuery) return true;

    return (
      loc.name.toLowerCase().includes(cleanQuery) ||
      loc.province.toLowerCase().includes(cleanQuery) ||
      (loc.description && loc.description.toLowerCase().includes(cleanQuery))
    );
  });
}

/**
 * Analisa e extrai coordenadas GPS de texto livre do usuário
 */
export function parseGPSCoordinates(input: string): { lat: number; lng: number } | null {
  if (!input) return null;

  const trimmed = input.trim();

  // Padrão 1: Formato decimal simples: -12.7761, 15.7392 ou -12.7761 15.7392
  const decimalMatch = trimmed.match(/^([-+]?\d{1,2}\.?\d*)[,\s]+([-+]?\d{1,3}\.?\d*)$/);
  if (decimalMatch) {
    const lat = parseFloat(decimalMatch[1]);
    const lng = parseFloat(decimalMatch[2]);

    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  // Padrão 2: Formato com pontos cardinais S/N E/W: 12.77° S, 15.73° E
  const dmsMatch = trimmed.match(/(\d+\.?\d*)\s*°?\s*([SsNn])[,\s]+(\d+\.?\d*)\s*°?\s*([EeWw])/);
  if (dmsMatch) {
    let lat = parseFloat(dmsMatch[1]);
    if (dmsMatch[2].toUpperCase() === 'S') lat = -lat;

    let lng = parseFloat(dmsMatch[3]);
    if (dmsMatch[4].toUpperCase() === 'W') lng = -lng;

    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  return null;
}
