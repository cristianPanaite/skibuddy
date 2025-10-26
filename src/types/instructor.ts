export interface InstructorSummary {
  id: string;
  name: string;
  photoUrl?: string | null;
  languages: string[];
  pricePerHourCents: number;
  whatsapp?: string | null;
  instagram?: string | null;
  featured: boolean;
  verified: boolean;
  resort: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface InstructorDetail extends InstructorSummary {
  bio?: string | null;
  tags: string[];
  active: boolean;
}
