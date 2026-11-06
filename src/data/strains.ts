import { StrainId } from '../types/simulation';

export interface BacterialStrainProfile {
  id: StrainId;
  scientificName: string;
  gramType: string;
  morphology: {
    en: string;
    vi: string;
  };
  targetHydrocarbons: {
    en: string;
    vi: string;
  };
  keyEnzyme: {
    en: string;
    vi: string;
  };
  biosurfactant: {
    en: string;
    vi: string;
  };
  description: {
    en: string;
    vi: string;
  };
  degradationRateMultiplier: number;
  color: string;
  secondaryColor: string;
}

export const BACTERIAL_STRAINS: Record<StrainId, BacterialStrainProfile> = {
  alcanivorax: {
    id: 'alcanivorax',
    scientificName: 'Alcanivorax borkumensis SK2',
    gramType: 'Gram-negative rod',
    morphology: {
      en: 'Halophilic, alkanotrophic rod-shaped bacterium (1.5–2.5 μm)',
      vi: 'Trực khuẩn ưa mặn chuyên phân hủy alkane (1.5–2.5 μm)',
    },
    targetHydrocarbons: {
      en: 'Linear & branched aliphatic alkanes (C₅–C₃₂)',
      vi: 'Alkane mạch thẳng và mạch nhánh (C₅–C₃₂)',
    },
    keyEnzyme: {
      en: 'AlkB1 / AlkB2 Integral Membrane Alkane Hydroxylases & Cytochrome P450',
      vi: 'Enzyme AlkB1 / AlkB2 Alkane Hydroxylase màng & Cytochrome P450',
    },
    biosurfactant: {
      en: 'Anionic glucose-lipid biosurfactant (reduces interfacial tension)',
      vi: 'Chất hoạt động bề mặt sinh học Glucose-lipid (giảm sức căng bề mặt dầu-nước)',
    },
    description: {
      en: 'Dominant cosmopolitan marine hydrocarbonoclastic bacterium that blooms rapidly in oil-polluted seawater, emulsifying crude slicks into bioavailable micro-droplets.',
      vi: 'Chủng vi khuẩn biển phân hủy hydrocarbon chủ lực, sinh khối tăng trưởng bùng nổ tại vùng nước nhiễm dầu và nhũ tương hóa váng dầu thô thành các vi giọt sinh khả dụng.',
    },
    degradationRateMultiplier: 1.15,
    color: '#22d3ee',
    secondaryColor: '#06b6d4',
  },
  cycloclasticus: {
    id: 'cycloclasticus',
    scientificName: 'Cycloclasticus pugetii',
    gramType: 'Gram-negative coccobacillus',
    morphology: {
      en: 'Obligate marine aromatic-degrading short rod (0.8–1.5 μm)',
      vi: 'Trực khuẩn ngắn chuyên phân hủy nhân thơm ở biển (0.8–1.5 μm)',
    },
    targetHydrocarbons: {
      en: 'Polycyclic Aromatic Hydrocarbons (PAHs: Naphthalene, Phenanthrene, Pyrene)',
      vi: 'Hydrocarbon thơm đa vòng (PAH: Naphthalene, Phenanthrene, Pyrene)',
    },
    keyEnzyme: {
      en: 'Ring-Hydroxylating Dioxygenases (RHD) & Catechol Dioxygenase',
      vi: 'Enzyme Dioxygenase gắn nhóm hydroxyl mở vòng thơm (RHD)',
    },
    biosurfactant: {
      en: 'Extracellular polymeric substances (EPS) matrix',
      vi: 'Mạng lưới chất полиme ngoại bào (EPS) bám dính giọt dầu',
    },
    description: {
      en: 'Targets the most persistent and toxic aromatic fractions of marine crude oil spills by cleaving benzene rings using molecular oxygen.',
      vi: 'Chuyên phân giải các phân đoạn vòng thơm độc hại và khó phân hủy nhất trong dầu thô bằng cơ chế oxy hóa cắt vòng benzene.',
    },
    degradationRateMultiplier: 1.0,
    color: '#34d399',
    secondaryColor: '#10b981',
  },
  marinobacter: {
    id: 'marinobacter',
    scientificName: 'Marinobacter hydrocarbonoclasticus',
    gramType: 'Gram-negative flagellated rod',
    morphology: {
      en: 'Motile oleophilic rod forming interfacial biofilms (2.0–3.0 μm)',
      vi: 'Trực khuẩn có tiên mao tạo màng sinh học tại ranh giới dầu-nước (2.0–3.0 μm)',
    },
    targetHydrocarbons: {
      en: 'Medium-to-long-chain n-alkanes (C₁₄–C₃₀) & waxy paraffins',
      vi: 'n-Alkane mạch trung bình đến dài (C₁₄–C₃₀) & sáp paraffin',
    },
    keyEnzyme: {
      en: 'Soluble Methane/Alkane Monooxygenase & Fatty Aldehyde Dehydrogenase',
      vi: 'Alkane Monooxygenase hòa tan & Fatty Aldehyde Dehydrogenase',
    },
    biosurfactant: {
      en: 'Phospholipid-rich oleophilic biofilm matrix',
      vi: 'Màng sinh học ưa dầu giàu phospholipid',
    },
    description: {
      en: 'Forms resilient oleophilic biofilms directly at the water-oil interface to solubilize hydrophobic paraffinic hydrocarbons.',
      vi: 'Hình thành màng sinh học (biofilm) bền vững ngay tại mặt phân cách dầu-nước để hòa tan và phân giải các hydrocarbon kỵ nước.',
    },
    degradationRateMultiplier: 1.05,
    color: '#38bdf8',
    secondaryColor: '#0284c7',
  },
  consortium: {
    id: 'consortium',
    scientificName: 'Synergistic Halophilic Consortium (Alcanivorax + Cycloclasticus + Marinobacter)',
    gramType: 'Multi-strain microbial guild',
    morphology: {
      en: 'Co-cultured alkanotrophic & PAH-degrading marine guild',
      vi: 'Tổ hợp cộng sinh đa chủng vi khuẩn phân hủy Alkane & vòng thơm PAH',
    },
    targetHydrocarbons: {
      en: 'Full-spectrum crude oil (Aliphatics, Branched Alkanes, and Toxic PAHs)',
      vi: 'Toàn phổ dầu thô (Mạch thẳng, mạch nhánh và vòng thơm độc hại PAH)',
    },
    keyEnzyme: {
      en: 'AlkB Hydroxylases + Ring-Cleaving Dioxygenases + Beta-Oxidation Pathway',
      vi: 'Tổ hợp AlkB Hydroxylase + Dioxygenase mở vòng + Chu trình Beta-Oxy hóa',
    },
    biosurfactant: {
      en: 'Synergistic glycolipid micelles + EPS biofilm stabilization',
      vi: 'Hạt micelle glycolipid kết hợp màng EPS ổn định nhũ tương',
    },
    description: {
      en: 'Optimal bioremediation strategy combining alkane emulsifiers and aromatic ring-cleavers for rapid, complete mineralization into CO₂ and H₂O.',
      vi: 'Chiến lược xử lý sinh học tối ưu kết hợp các chủng nhũ tương hóa alkane và chủng cắt vòng thơm, giúp khoáng hóa triệt để dầu tràn thành CO₂ và H₂O.',
    },
    degradationRateMultiplier: 1.4,
    color: '#2dd4bf',
    secondaryColor: '#14b8a6',
  },
};
