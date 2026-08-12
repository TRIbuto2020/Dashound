export type PublicationStatus = "draft" | "published" | "archived";

export type PageKind = "project" | "guide" | "editorial";

export type PageSummaryItem = {
  label: string;
  value: string;
};

export type TextBlock = {
  id: string;
  type: "text";
  title: string;
  paragraphs: string[];
};

export type SummaryBlock = {
  id: string;
  type: "summary";
  title?: string;
  paragraphs?: string[];
  items: PageSummaryItem[];
};

export type TimelineBlock = {
  id: string;
  type: "timeline";
  title: string;
  introduction?: string;
  items: Array<{
    title: string;
    text: string;
  }>;
  callout?: {
    title: string;
    text: string;
  };
};

export type CardGridBlock = {
  id: string;
  type: "card-grid";
  title: string;
  introduction?: string;
  cards: Array<{
    eyebrow: string;
    title: string;
    text: string;
  }>;
};

export type TableCell = {
  text: string;
  href?: string;
};

export type TableBlock = {
  id: string;
  type: "table";
  title: string;
  introduction?: string;
  caption: string;
  columns: string[];
  rows: TableCell[][];
  closing?: string;
};

export type PageBlock =
  | TextBlock
  | SummaryBlock
  | TimelineBlock
  | CardGridBlock
  | TableBlock;

export type ContentPage = {
  id: string;
  slug: string;
  kind: PageKind;
  status: PublicationStatus;
  eyebrow: string;
  title: string;
  summary: string;
  featured: boolean;
  featuredPosition?: number;
  card: {
    eyebrow: string;
    title: string;
    text: string;
    action: string;
    image?: string;
    imageAlt?: string;
    mosaic?: Array<{
      image: string;
      imageAlt: string;
    }>;
    placeholder?: string;
  };
  seo: {
    title: string;
    description: string;
  };
  blocks: PageBlock[];
  publishedAt?: string;
  updatedAt: string;
};

export type Recommendation = {
  id: string;
  categoryId: string;
  status: PublicationStatus;
  eyebrow: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  imageAlt?: string;
  placeholder?: string;
  action: string;
  position: number;
  isAffiliate: boolean;
};

export type RecommendationCategory = {
  id: string;
  title: string;
  description?: string;
  position: number;
};
