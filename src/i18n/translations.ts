import { Language } from '../types/simulation';

export const TRANSLATIONS: Record<Language, {
  appTitle: string;
  appSubtitle: string;
  labBadge: string;
  fpsLabel: string;
  labels3d: string;
  theme: {
    light: string;
    dark: string;
    system: string;
    label: string;
  };
  language: {
    en: string;
    vi: string;
  };
  steps: {
    1: {
      shortTitle: string;
      title: string;
      subtitle: string;
      badge: string;
      description: string;
      tooltip: string;
      mechanismTitle: string;
      mechanismDetail: string;
    };
    2: {
      shortTitle: string;
      title: string;
      subtitle: string;
      badge: string;
      description: string;
      tooltip: string;
      mechanismTitle: string;
      mechanismDetail: string;
    };
    3: {
      shortTitle: string;
      title: string;
      subtitle: string;
      badge: string;
      description: string;
      tooltip: string;
      mechanismTitle: string;
      mechanismDetail: string;
    };
    4: {
      shortTitle: string;
      title: string;
      subtitle: string;
      badge: string;
      description: string;
      tooltip: string;
      mechanismTitle: string;
      mechanismDetail: string;
    };
  };
  hud: {
    telemetryTitle: string;
    telemetrySubtitle: string;
    statusContaminated: string;
    statusInoculated: string;
    statusBiodegrading: string;
    statusRestored: string;
    metrics: {
      tph: {
        label: string;
        unit: string;
        tooltip: string;
      };
      toxicity: {
        label: string;
        unit: string;
        tooltip: string;
      };
      cod: {
        label: string;
        unit: string;
        tooltip: string;
      };
      bod5: {
        label: string;
        unit: string;
        tooltip: string;
      };
      do: {
        label: string;
        unit: string;
        tooltip: string;
      };
      bacteria: {
        label: string;
        unit: string;
        tooltip: string;
      };
      slickThickness: {
        label: string;
        unit: string;
        tooltip: string;
      };
      biosurfactant: {
        label: string;
        unit: string;
        tooltip: string;
      };
    };
  };
  controls: {
    prevStep: string;
    nextStep: string;
    step1: {
      panelTitle: string;
      spillIntensity: string;
      waveEnergy: string;
      inspectCrossSection: string;
      proceedCta: string;
      contaminationWarning: string;
      surfaceCoverage: string;
      viscosityDamping: string;
    };
    step2: {
      panelTitle: string;
      selectStrain: string;
      targetLabel: string;
      enzymeLabel: string;
      surfactantLabel: string;
      nutrientBoost: string;
      nutrientTooltip: string;
      releaseButton: string;
      releaseAnotherDose: string;
      dosesReleased: string;
      clickSurfaceHint: string;
      proceedToMicro: string;
    };
    step3: {
      panelTitle: string;
      microscopeActive: string;
      reactionEquationTitle: string;
      reactionEquationSub: string;
      enzymaticActivity: string;
      aerationBoost: string;
      attachedBacteriaCount: string;
      emulsifiedDroplets: string;
      byproductsTitle: string;
      co2Released: string;
      h2oProduced: string;
      proceedToCleanup: string;
    };
    step4: {
      panelTitle: string;
      progressLabel: string;
      autoSimulate: string;
      pauseSimulate: string;
      simSpeed: string;
      scrubTimeline: string;
      resetSpill: string;
      waterClarity: string;
      oilRemoved: string;
      ecologicalStatus: string;
      restoredCompleteMsg: string;
    };
  };
  camera: {
    presetsTitle: string;
    overview: string;
    surface: string;
    microscopic: string;
    topDown: string;
    rotateLeft: string;
    rotateRight: string;
    zoomIn: string;
    zoomOut: string;
    autoOrbit: string;
    resetView: string;
    interactionHint: string;
  };
  sceneLabels: {
    oilSlickLayer: string;
    oilSlickSub: string;
    waterColumn: string;
    waterColumnSub: string;
    inoculumPlume: string;
    inoculumPlumeSub: string;
    oilDropletMicelle: string;
    oilDropletMicelleSub: string;
    alcanivoraxBiofilm: string;
    alcanivoraxBiofilmSub: string;
    byproductsCloud: string;
    byproductsCloudSub: string;
    cleanMarineWater: string;
    cleanMarineWaterSub: string;
  };
}> = {
  en: {
    appTitle: 'BioMaris 3D',
    appSubtitle: 'Marine Oil Spill Bioremediation Laboratory',
    labBadge: 'HYDROCARBON BIODEGRADATION SIMULATOR',
    fpsLabel: 'FPS',
    labels3d: '3D Callouts',
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      label: 'Theme',
    },
    language: {
      en: 'EN',
      vi: 'VI',
    },
    steps: {
      1: {
        shortTitle: 'Oil Spill Overview',
        title: 'Step 1: Marine Oil Spill Contamination',
        subtitle: 'Hydrophobic crude oil slick blankets the ocean surface, blocking gas exchange and light penetration.',
        badge: 'PHASE 01 • CONTAMINATION ASSESSMENT',
        description:
          'Crude petroleum consists of complex aliphatic alkanes, cycloalkanes, and toxic Polycyclic Aromatic Hydrocarbons (PAHs). Because oil is hydrophobic and less dense than seawater, it spreads rapidly into a viscous, glossy surface slick that suppresses capillary waves and induces severe hypoxia.',
        tooltip:
          'Observe the dark, high-viscosity hydrocarbon slick over the ocean water column and inspect baseline pollution metrics (TPH, Toxicity, COD/BOD₅).',
        mechanismTitle: 'Physicochemical Slick Behavior',
        mechanismDetail:
          'High interfacial tension prevents oil from dissolving in water. Without biological emulsification, toxic aromatic fractions persist and threaten marine trophic webs.',
      },
      2: {
        shortTitle: 'Bacterial Inoculation',
        title: 'Step 2: Bioaugmentation & Inoculation',
        subtitle: 'Deploy hydrocarbonoclastic bacterial strains and oleophilic nutrients into the contaminated slick.',
        badge: 'PHASE 02 • MICROBIAL INOCULATION',
        description:
          'Select specialized marine hydrocarbon-degrading bacteria such as Alcanivorax borkumensis and release them onto the slick. Supplementing with oleophilic nitrogen and phosphorus (biostimulation) overcomes nutrient limitation in open seawater.',
        tooltip:
          'Choose a bacterial strain and click "Release Bacterial Inoculum" (or click directly on the 3D ocean surface) to seed the oil slick.',
        mechanismTitle: 'Chemotaxis & Biosurfactant Secretion',
        mechanismDetail:
          'Inoculated bacteria migrate toward the oil-water interface via chemotaxis and secrete amphiphilic glycolipid biosurfactants that shatter the coherent slick into micro-droplets.',
      },
      3: {
        shortTitle: 'Enzymatic Action',
        title: 'Step 3: Microscopic Enzymatic Biodegradation',
        subtitle: 'Close-up 3D view of bacteria colonizing oil droplets and cleaving hydrocarbon chains into CO₂ and H₂O.',
        badge: 'PHASE 03 • ENZYMATIC MINERALIZATION',
        description:
          'At the microscopic oil-water interface, rod-shaped bacteria attach to emulsified hydrocarbon droplets, forming dense biofilms. Membrane-bound AlkB alkane hydroxylases and ring-hydroxylating dioxygenases insert molecular oxygen into C–H bonds, converting toxic hydrocarbons into fatty acids that enter the β-oxidation and TCA cycles.',
        tooltip:
          'Zoom inside the oil-water interface to witness bacterial attachment, binary fission, and enzymatic conversion of hydrocarbons into harmless CO₂ and H₂O molecules.',
        mechanismTitle: 'Terminal Oxidation & β-Oxidation Pathway',
        mechanismDetail:
          'AlkB Hydroxylase oxidizes n-alkanes into primary alcohols → aldehydes → fatty acids → Acetyl-CoA → Citric Acid Cycle, yielding harmless CO₂ and H₂O.',
      },
      4: {
        shortTitle: 'Cleanup & Restoration',
        title: 'Step 4: Bioremediation Progress & Ecosystem Recovery',
        subtitle: 'Track real-time hydrocarbon mineralization as the dark oil slick dissipates and marine clarity returns.',
        badge: 'PHASE 04 • MARINE RESTORATION',
        description:
          'As enzymatic mineralization progresses, the viscous surface slick progressively thins, fragments, and vanishes. Total Petroleum Hydrocarbons (TPH), COD, and ecological toxicity drop sharply, restoring dissolved oxygen transport and clear photic zone illumination.',
        tooltip:
          'Control or scrub through the cleanup timeline to observe the gradual dissipation of the oil slick and full restoration of clean marine water.',
        mechanismTitle: 'Self-Limiting Microbial Homeostasis',
        mechanismDetail:
          'Once petroleum carbon sources are depleted into CO₂ and H₂O, hydrocarbonoclastic bacterial populations naturally decline back to baseline marine levels.',
      },
    },
    hud: {
      telemetryTitle: 'Environmental Telemetry',
      telemetrySubtitle: 'Real-time Seawater & Slick Diagnostics',
      statusContaminated: 'CRITICAL CONTAMINATION',
      statusInoculated: 'BIOAUGMENTATION ACTIVE',
      statusBiodegrading: 'ENZYMATIC OXIDATION',
      statusRestored: 'ECOSYSTEM RESTORED',
      metrics: {
        tph: {
          label: 'Hydrocarbons (TPH)',
          unit: 'mg/L',
          tooltip: 'Total Petroleum Hydrocarbons: Measures the total concentration of aliphatic and aromatic crude oil compounds in the surface water column. Safe baseline is < 5 mg/L.',
        },
        toxicity: {
          label: 'Acute Toxicity Index',
          unit: 'TU',
          tooltip: 'Ecological Acute Toxicity Units (Microtox bioassay equivalent): Reflects the bioavailable toxicity of dissolved PAHs and volatile aromatics to marine biota.',
        },
        cod: {
          label: 'COD (Chemical O₂ Demand)',
          unit: 'mg/L',
          tooltip: 'Chemical Oxygen Demand: Total oxygen required to chemically oxidize all organic hydrocarbon pollutants in the water sample.',
        },
        bod5: {
          label: 'BOD₅ (Biological O₂ Demand)',
          unit: 'mg/L',
          tooltip: '5-Day Biochemical Oxygen Demand: Amount of dissolved oxygen consumed by aerobic microorganisms while decomposing hydrocarbons.',
        },
        do: {
          label: 'Dissolved Oxygen (DO)',
          unit: 'mg/L',
          tooltip: 'Dissolved Oxygen concentration in seawater. Oil slicks block atmospheric gas exchange, while aerobic biodegradation temporarily consumes O₂ before recovery.',
        },
        bacteria: {
          label: 'Bacterial Density',
          unit: 'CFU/mL',
          tooltip: 'Colony-Forming Units per mL: Tracks the exponential growth of hydrocarbonoclastic bacteria colonizing the oil-water interface.',
        },
        slickThickness: {
          label: 'Oil Slick Thickness',
          unit: 'mm',
          tooltip: 'Mean thickness of the floating hydrophobic petroleum layer on the sea surface.',
        },
        biosurfactant: {
          label: 'Emulsification Index (E₂₄)',
          unit: '%',
          tooltip: 'Measures the percentage of crude oil emulsified into high-surface-area micro-droplets by bacterial glycolipid biosurfactants.',
        },
      },
    },
    controls: {
      prevStep: 'Previous Step',
      nextStep: 'Next Step',
      step1: {
        panelTitle: 'Spill Diagnostic Controls',
        spillIntensity: 'Initial Crude Oil Concentration',
        waveEnergy: 'Surface Wave Hydrodynamics',
        inspectCrossSection: 'Highlight Slick Boundary Layer',
        proceedCta: 'Proceed to Step 2: Bacterial Inoculation',
        contaminationWarning: 'Severe hydrophobic oil layer detected. Gas exchange and light penetration reduced by 88%.',
        surfaceCoverage: 'Slick Surface Coverage',
        viscosityDamping: 'Capillary Wave Damping',
      },
      step2: {
        panelTitle: 'Bioaugmentation Dispenser',
        selectStrain: 'Select Hydrocarbonoclastic Strain',
        targetLabel: 'Target Substrate',
        enzymeLabel: 'Primary Enzyme System',
        surfactantLabel: 'Biosurfactant Type',
        nutrientBoost: 'Oleophilic Nutrient Supplement (N:P Ratio)',
        nutrientTooltip: 'Adding slow-release oleophilic nitrogen and phosphorus fertilizers accelerates bacterial division on carbon-rich oil droplets.',
        releaseButton: 'Release Bacterial Inoculum',
        releaseAnotherDose: 'Deploy Additional Inoculum Plume',
        dosesReleased: 'Inoculum Plumes Deployed',
        clickSurfaceHint: 'Tip: You can also click directly on the 3D oil slick to drop targeted bacterial doses.',
        proceedToMicro: 'Inspect Microscopic Action (Step 3)',
      },
      step3: {
        panelTitle: 'Microscopic Biokinetics Control',
        microscopeActive: 'MICROSCOPIC OIL-WATER INTERFACE (400×)',
        reactionEquationTitle: 'Aerobic Alkane Mineralization Reaction',
        reactionEquationSub: '2 C₁₆H₃₄ (Hexadecane) + 49 O₂  ──(AlkB Hydroxylase)──▶  32 CO₂↑ + 34 H₂O',
        enzymaticActivity: 'Enzymatic Turnover Rate (kcat)',
        aerationBoost: 'Dissolved O₂ & Metabolic Rate',
        attachedBacteriaCount: 'Active Biofilm Cells on Droplets',
        emulsifiedDroplets: 'Emulsified Oil Micro-Globules',
        byproductsTitle: 'Harmless Mineralization Byproducts',
        co2Released: 'Carbon Dioxide (CO₂)',
        h2oProduced: 'Water Molecules (H₂O)',
        proceedToCleanup: 'Track Full Restoration (Step 4)',
      },
      step4: {
        panelTitle: 'Bioremediation Restoration Tracker',
        progressLabel: 'Total Bioremediation Progress',
        autoSimulate: 'Play Restoration',
        pauseSimulate: 'Pause',
        simSpeed: 'Simulation Speed',
        scrubTimeline: 'Manual Restoration Timeline Scrubber',
        resetSpill: 'Reset Simulation to Step 1',
        waterClarity: 'Marine Photic Transmittance',
        oilRemoved: 'Hydrocarbon Mass Mineralized',
        ecologicalStatus: 'Marine Habitat Status',
        restoredCompleteMsg: 'Bioremediation complete! 99.4% of toxic hydrocarbons have been mineralized into harmless CO₂ and H₂O.',
      },
    },
    camera: {
      presetsTitle: 'Camera View',
      overview: '3D Tank Overview',
      surface: 'Slick Grazing',
      microscopic: 'Microscopic (400×)',
      topDown: 'Aerial Top-Down',
      rotateLeft: 'Rotate Left',
      rotateRight: 'Rotate Right',
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      autoOrbit: 'Auto-Orbit',
      resetView: 'Reset Camera',
      interactionHint: 'Drag to rotate • Scroll to zoom • Click surface in Step 2 to inoculate',
    },
    sceneLabels: {
      oilSlickLayer: 'Viscous Crude Oil Slick',
      oilSlickSub: 'Hydrophobic Alkanes & PAHs',
      waterColumn: 'Marine Photic Zone',
      waterColumnSub: 'Seawater Column (35 PSU)',
      inoculumPlume: 'Bacterial Inoculum Plume',
      inoculumPlumeSub: 'Chemotactic Migration to Slick',
      oilDropletMicelle: 'Emulsified Oil Droplet',
      oilDropletMicelleSub: 'C₁₆H₃₄ Hydrocarbon Core',
      alcanivoraxBiofilm: 'Attached Bacterial Biofilm',
      alcanivoraxBiofilmSub: 'AlkB Enzyme Oxidation',
      byproductsCloud: 'CO₂ & H₂O Byproducts',
      byproductsCloudSub: 'Harmless Mineralization Output',
      cleanMarineWater: 'Restored Marine Water',
      cleanMarineWaterSub: 'High Dissolved O₂ & Clarity',
    },
  },
  vi: {
    appTitle: 'BioMaris 3D',
    appSubtitle: 'Phòng Thí Nghiệm Phân Hủy Sinh Học Dầu Tràn Trên Biển',
    labBadge: 'MÔ PHỎNG VI KHUẨN PHÂN HỦY HYDROCARBON',
    fpsLabel: 'FPS',
    labels3d: 'Nhãn 3D',
    theme: {
      light: 'Sáng',
      dark: 'Tối',
      system: 'Hệ thống',
      label: 'Giao diện',
    },
    language: {
      en: 'EN',
      vi: 'VI',
    },
    steps: {
      1: {
        shortTitle: 'Tổng Quan Dầu Tràn',
        title: 'Bước 1: Hiện Trạng Ô Nhiễm Dầu Tràn Trên Biển',
        subtitle: 'Lớp váng dầu thô kỵ nước dày đặc bao phủ mặt biển, ngăn cản trao đổi khí và ánh sáng.',
        badge: 'GIAI ĐOẠN 01 • ĐÁNH GIÁ Ô NHIỄM',
        description:
          'Dầu mỏ thô chứa hỗn hợp phức tạp các alkane mạch thẳng, cycloalkane và Hydrocarbon thơm đa vòng (PAH) độc hại. Do tính chất kỵ nước và nhẹ hơn nước biển, dầu nhanh chóng loang thành lớp váng bóng nhẫy, triệt tiêu sóng mao dẫn và gây thiếu oxy nghiêm trọng.',
        tooltip:
          'Quan sát lớp váng dầu thô đen bóng trên bề mặt cột nước biển và theo dõi các chỉ số ô nhiễm thời gian thực (TPH, Độc tính, COD/BOD₅).',
        mechanismTitle: 'Đặc Tính Lý Hóa Của Váng Dầu',
        mechanismDetail:
          'Sức căng bề mặt phân cách cao khiến dầu không thể tự hòa tan. Nếu không được nhũ tương hóa sinh học, các hợp chất vòng thơm độc hại sẽ tồn lưu lâu dài trong hệ sinh thái biển.',
      },
      2: {
        shortTitle: 'Cấy Chủng Vi Khuẩn',
        title: 'Bước 2: Phóng Thích Chủng Vi Khuẩn Phân Hủy Dầu',
        subtitle: 'Thả các chủng vi khuẩn biển chuyên biệt (Alcanivorax borkumensis) và dưỡng chất ưa dầu vào vùng ô nhiễm.',
        badge: 'GIAI ĐOẠN 02 • CẤY CHỦNG VI SINH (BIOAUGMENTATION)',
        description:
          'Lựa chọn chủng vi khuẩn phân hủy hydrocarbon chuyên biệt như Alcanivorax borkumensis để thả xuống vùng nước nhiễm dầu. Kết hợp bổ sung dưỡng chất Nitơ và Photpho ưa dầu (kích thích sinh học) giúp vi khuẩn nhân đôi nhanh chóng trên bề mặt giọt dầu.',
        tooltip:
          'Chọn chủng vi khuẩn và nhấn nút "Thả Chủng Vi Khuẩn" (hoặc nhấp trực tiếp lên mặt biển 3D) để cấy vi sinh vật vào váng dầu.',
        mechanismTitle: 'Hóa Hướng Động & Tiết Chất Hoạt Động Bề Mặt Sinh Học',
        mechanismDetail:
          'Vi khuẩn di chuyển về phía ranh giới dầu-nước nhờ cơ chế hóa hướng động và tiết ra biosurfactant bản chất glycolipid giúp phá vỡ váng dầu đặc thành các vi giọt.',
      },
      3: {
        shortTitle: 'Phân Hủy Bằng Enzyme',
        title: 'Bước 3: Cơ Chế Phân Hủy Hydrocarbon Bằng Enzyme (Cận Cảnh Vi Mô)',
        subtitle: 'Góc nhìn hiển vi 3D: Vi khuẩn bám vào giọt dầu, sinh sôi và cắt mạch hydrocarbon thành CO₂ và H₂O vô hại.',
        badge: 'GIAI ĐOẠN 03 • KHOÁNG HÓA BẰNG ENZYME',
        description:
          'Ở cấp độ vi mô tại mặt phân cách dầu-nước, các trực khuẩn bám chặt quanh giọt dầu nhũ tương hóa, nhân đôi tạo màng sinh học (biofilm). Hệ enzyme AlkB hydroxylase và dioxygenase gắn phân tử oxy vào mạch carbon, chuyển hóa hydrocarbon độc hại thành axit béo đi vào chu trình β-oxy hóa để tạo ra CO₂ và nước (H₂O).',
        tooltip:
          'Quan sát cận cảnh vi mô quá trình vi khuẩn bám dính giọt dầu, phân chia tế bào và xúc tác phản ứng phân giải hydrocarbon thành phân tử CO₂ và H₂O.',
        mechanismTitle: 'Con Đường Oxy Hóa Đầu Mạch & Chu Trình β-Oxy Hóa',
        mechanismDetail:
          'Enzyme AlkB Hydroxylase oxy hóa n-alkane thành rượu bậc một → aldehyde → axit béo → Acetyl-CoA → Chu trình Krebs, giải phóng hoàn toàn thành CO₂ và H₂O.',
      },
      4: {
        shortTitle: 'Làm Sạch & Phục Hồi',
        title: 'Bước 4: Tiến Độ Xử Lý Sinh Học & Phục Hồi Môi Trường Biển',
        subtitle: 'Theo dõi quá trình váng dầu mỏng dần, tan biến và trả lại làn nước biển trong xanh, giàu oxy.',
        badge: 'GIAI ĐOẠN 04 • PHỤC HỒI HỆ SINH THÁI',
        description:
          'Khi quá trình khoáng hóa bằng enzyme diễn ra, lớp váng dầu đen dày đặc mỏng dần, đứt gãy và biến mất hoàn toàn. Nồng độ Hydrocarbon (TPH), COD và độc tính sinh thái giảm mạnh về ngưỡng an toàn, khôi phục quá trình khuếch tán oxy và độ trong suốt của nước biển.',
        tooltip:
          'Theo dõi thanh tiến độ xử lý sinh học hoặc kéo thanh thời gian để quan sát hiệu ứng váng dầu tan biến dần và phục hồi trạng thái nước biển sạch.',
        mechanismTitle: 'Cân Bằng Nội Môi Vi Sinh Tự Giới Hạn',
        mechanismDetail:
          'Sau khi nguồn carbon từ dầu mỏ được chuyển hóa hết thành CO₂ và H₂O, mật độ vi khuẩn phân hủy dầu tự động giảm về mức nền tự nhiên của đại dương.',
      },
    },
    hud: {
      telemetryTitle: 'Thông Số Môi Trường Thực Tế',
      telemetrySubtitle: 'Quan Trắc Chất Lượng Nước Biển & Váng Dầu',
      statusContaminated: 'Ô NHIỄM NGHIÊM TRỌNG',
      statusInoculated: 'ĐÃ CẤY CHỦNG VI SINH',
      statusBiodegrading: 'ĐANG PHÂN HỦY ENZYME',
      statusRestored: 'ĐÃ PHỤC HỒI SẠCH',
      metrics: {
        tph: {
          label: 'Nồng Độ Hydrocarbon (TPH)',
          unit: 'mg/L',
          tooltip: 'Tổng Hydrocarbon Dầu Mỏ (Total Petroleum Hydrocarbons): Đo tổng nồng độ các hợp chất alkane và vòng thơm trong tầng nước mặt. Ngưỡng an toàn sinh thái < 5 mg/L.',
        },
        toxicity: {
          label: 'Chỉ Số Độc Tính Cấp (TU)',
          unit: 'TU',
          tooltip: 'Đơn vị độc tính sinh thái cấp tính (Acute Toxicity Units): Phản ánh mức độ gây độc của các hợp chất PAH hòa tan đối với sinh vật phù du và ấu trùng biển.',
        },
        cod: {
          label: 'Nhu Cầu Oxy Hóa Học (COD)',
          unit: 'mg/L',
          tooltip: 'Chemical Oxygen Demand: Lượng oxy cần thiết để oxy hóa toàn bộ các chất hữu cơ và hydrocarbon ô nhiễm trong nước biển.',
        },
        bod5: {
          label: 'Nhu Cầu Oxy Sinh Hóa (BOD₅)',
          unit: 'mg/L',
          tooltip: '5-Day Biochemical Oxygen Demand: Lượng oxy hòa tan mà vi sinh vật hiếu khí tiêu thụ trong 5 ngày để phân giải dầu mỏ.',
        },
        do: {
          label: 'Oxy Hòa Tan (DO)',
          unit: 'mg/L',
          tooltip: 'Nồng độ Oxy hòa tan trong nước biển. Váng dầu ngăn cản khuếch tán oxy từ khí quyển, sau khi dầu được làm sạch DO sẽ phục hồi về mức bão hòa (~7.8 mg/L).',
        },
        bacteria: {
          label: 'Mật Độ Vi Khuẩn',
          unit: 'CFU/mL',
          tooltip: 'Số đơn vị hình thành khuẩn lạc trên mỗi mL (Colony-Forming Units): Phản ánh tốc độ nhân đôi sinh khối của vi khuẩn phân hủy dầu.',
        },
        slickThickness: {
          label: 'Độ Dày Váng Dầu',
          unit: 'mm',
          tooltip: 'Độ dày trung bình của lớp màng dầu thô nổi trên bề mặt nước biển.',
        },
        biosurfactant: {
          label: 'Chỉ Số Nhũ Tương Hóa (E₂₄)',
          unit: '%',
          tooltip: 'Tỷ lệ phần trăm váng dầu đã được chất hoạt động bề mặt sinh học (biosurfactant) phân tách thành các hạt vi giọt diện tích bề mặt lớn.',
        },
      },
    },
    controls: {
      prevStep: 'Bước Trước',
      nextStep: 'Bước Tiếp Theo',
      step1: {
        panelTitle: 'Bảng Điều Khiển Khảo Sát Váng Dầu',
        spillIntensity: 'Mức Độ Đậm Đặc Của Váng Dầu Thô',
        waveEnergy: 'Động Lực Học Sóng Bề Mặt',
        inspectCrossSection: 'Hiển Thị Ranh Giới Mặt Cắt Váng Dầu',
        proceedCta: 'Chuyển Sang Bước 2: Thả Chủng Vi Khuẩn',
        contaminationWarning: 'Cảnh báo: Lớp dầu kỵ nước dày đặc đang chặn 88% ánh sáng và quá trình trao đổi oxy bề mặt.',
        surfaceCoverage: 'Độ Phủ Bề Mặt Váng Dầu',
        viscosityDamping: 'Độ Nhớt Triệt Tiêu Sóng',
      },
      step2: {
        panelTitle: 'Bộ Phóng Thích Vi Khuẩn Phân Hủy Dầu',
        selectStrain: 'Chọn Chủng Vi Khuẩn Phân Hủy Hydrocarbon',
        targetLabel: 'Cơ Chất Mục Tiêu',
        enzymeLabel: 'Hệ Enzyme Chủ Đạo',
        surfactantLabel: 'Chất Hoạt Động Bề Mặt',
        nutrientBoost: 'Bổ Sung Dưỡng Chất Ưa Dầu (Tỷ Lệ N:P)',
        nutrientTooltip: 'Bổ sung nguồn Nitơ và Photpho ưa dầu giúp vi khuẩn khắc phục sự thiếu hụt dinh dưỡng và tăng tốc độ phân bào trên bề mặt giọt dầu.',
        releaseButton: 'Thả Chủng Vi Khuẩn Vào Nước',
        releaseAnotherDose: 'Thả Thêm Liều Vi Khuẩn Mới',
        dosesReleased: 'Số Liều Vi Khuẩn Đã Thả',
        clickSurfaceHint: 'Mẹo: Bạn có thể nhấp trực tiếp lên mặt váng dầu 3D để thả vi khuẩn tại vị trí bất kỳ.',
        proceedToMicro: 'Quan Sát Cận Cảnh Vi Mô (Bước 3)',
      },
      step3: {
        panelTitle: 'Điều Khiển Động Học Phân Hủy Vi Mô',
        microscopeActive: 'GÓC NHÌN HIỂN VI MẶT PHÂN CÁCH DẦU - NƯỚC (400×)',
        reactionEquationTitle: 'Phương Trình Khoáng Hóa Hiếu Khí Alkane',
        reactionEquationSub: '2 C₁₆H₃₄ (Hexadecane) + 49 O₂  ──(Enzyme AlkB)──▶  32 CO₂↑ + 34 H₂O',
        enzymaticActivity: 'Hoạt Độ Xúc Tác Enzyme (kcat)',
        aerationBoost: 'Cấp Oxy Hòa Tan & Tốc Độ Trao Đổi Chất',
        attachedBacteriaCount: 'Tế Bào Vi Khuẩn Bám Dính Giọt Dầu',
        emulsifiedDroplets: 'Số Vi Giọt Dầu Đang Phân Giải',
        byproductsTitle: 'Sản Phẩm Phụ Vô Hại Sau Phân Giải',
        co2Released: 'Khí Carbon Dioxide (CO₂)',
        h2oProduced: 'Phân Tử Nước Tinh Khiết (H₂O)',
        proceedToCleanup: 'Xem Tiến Độ Làm Sạch (Bước 4)',
      },
      step4: {
        panelTitle: 'Theo Dõi Tiến Độ Làm Sạch & Phục Hồi',
        progressLabel: 'Tiến Độ Phân Hủy Sinh Học Tổng Thể',
        autoSimulate: 'Chạy Tự Động',
        pauseSimulate: 'Tạm Dừng',
        simSpeed: 'Tốc Độ Mô Phỏng',
        scrubTimeline: 'Thanh Kéo Quan Sát Quá Trình Làm Sạch',
        resetSpill: 'Đặt Lại Mô Phỏng Về Bước 1',
        waterClarity: 'Độ Trong Suốt Cột Nước Biển',
        oilRemoved: 'Lượng Hydrocarbon Đã Khoáng Hóa',
        ecologicalStatus: 'Trạng Thái Sinh Thái Biển',
        restoredCompleteMsg: 'Hoàn tất xử lý sinh học! 99.4% lượng dầu độc hại đã được vi khuẩn phân giải thành CO₂ và H₂O vô hại.',
      },
    },
    camera: {
      presetsTitle: 'Góc Máy Quay',
      overview: 'Tổng Quan 3D',
      surface: 'Cận Mặt Thoáng',
      microscopic: 'Hiển Vi (400×)',
      topDown: 'Từ Trên Cao',
      rotateLeft: 'Xoay Trái',
      rotateRight: 'Xoay Phải',
      zoomIn: 'Phóng To',
      zoomOut: 'Thu Nhỏ',
      autoOrbit: 'Tự Xoay',
      resetView: 'Đặt Lại Góc Nhìn',
      interactionHint: 'Kéo chuột để xoay • Cuộn để phóng to/thu nhỏ • Nhấp mặt nước ở Bước 2 để thả vi khuẩn',
    },
    sceneLabels: {
      oilSlickLayer: 'Lớp Váng Dầu Thô Đậm Đặc',
      oilSlickSub: 'Chứa Alkane & Vòng Thơm PAH',
      waterColumn: 'Tầng Nước Mặt Đại Dương',
      waterColumnSub: 'Độ mặn tiêu chuẩn (35 PSU)',
      inoculumPlume: 'Đám Mây Chủng Vi Khuẩn',
      inoculumPlumeSub: 'Hóa hướng động bám vào váng dầu',
      oilDropletMicelle: 'Vi Giọt Dầu Nhũ Tương Hóa',
      oilDropletMicelleSub: 'Lõi Hydrocarbon C₁₆H₃₄',
      alcanivoraxBiofilm: 'Màng Sinh Học Vi Khuẩn (Biofilm)',
      alcanivoraxBiofilmSub: 'Tiết enzyme AlkB cắt mạch dầu',
      byproductsCloud: 'Phân Tử CO₂ & H₂O Giải Phóng',
      byproductsCloudSub: 'Sản phẩm phụ vô hại với môi trường',
      cleanMarineWater: 'Nước Biển Đã Được Làm Sạch',
      cleanMarineWaterSub: 'Độ trong suốt & Oxy hòa tan cao',
    },
  },
};
