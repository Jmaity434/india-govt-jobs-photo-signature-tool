/**
 * INDIAN GOVERNMENT RECRUITMENT SPECIFICATION REGISTRY
 * Central bodies + all 28 States + 8 Union Territories
 * Source: Official notifications (compiled 2026)
 */
const RECRUITMENT_REGISTRY = {
  central: {
    ssc: {
      name: "Staff Selection Commission (SSC)",
      capitalQuery: "new-delhi,india-gate,parliament",
      capitalName: "New Delhi",
      specs: {
        photo: { width: 413, height: 531, minKb: 20, maxKb: 50, label: "SSC Passport Photo (3.5x4.5cm @ 300 DPI)" },
        signature: { width: 708, height: 236, minKb: 10, maxKb: 20, label: "SSC Signature (6.0x2.0cm @ 300 DPI, Horizontal)" }
      }
    },
    rrb: {
      name: "Railway Recruitment Board (RRB)",
      capitalQuery: "railway,station,india",
      capitalName: "New Delhi",
      specs: {
        photo: { width: 413, height: 531, minKb: 30, maxKb: 70, label: "RRB Photo (3.5x4.5cm, White Background)" },
        signature: { width: 140, height: 60, minKb: 30, maxKb: 70, label: "RRB Cursive Signature (No Block Capitals)" }
      }
    },
    upsc: {
      name: "Union Public Service Commission (UPSC)",
      capitalQuery: "new-delhi,rashtrapati-bhavan,india",
      capitalName: "New Delhi",
      specs: {
        photo: { width: 500, height: 500, minKb: 20, maxKb: 300, allowNameDate: true, label: "UPSC Photo (Square, Name & Date required)" },
        signature: { width: 500, height: 500, minKb: 20, maxKb: 300, label: "UPSC Official Signature (Square)" }
      }
    },
    ibps: {
      name: "Banking Services (IBPS / SBI)",
      capitalQuery: "mumbai,gateway-of-india,financial",
      capitalName: "Mumbai",
      specs: {
        photo: { width: 450, height: 350, minKb: 20, maxKb: 50, label: "IBPS Photo (4.5x3.5cm)" },
        signature: { width: 140, height: 60, minKb: 10, maxKb: 20, label: "IBPS Black Ink Signature" },
        thumb: { width: 240, height: 240, minKb: 20, maxKb: 50, label: "IBPS Left Thumb Impression" },
        declaration: { width: 800, height: 400, minKb: 50, maxKb: 100, label: "IBPS Handwritten Declaration" }
      }
    },
    nta: {
      name: "National Testing Agency (NEET / JEE / CUET)",
      capitalQuery: "delhi,university,campus",
      capitalName: "New Delhi",
      specs: {
        photo: { width: 413, height: 531, minKb: 10, maxKb: 200, label: "NTA Passport Photograph" },
        postcard: { width: 1200, height: 1800, minKb: 10, maxKb: 200, label: "NEET Postcard Photo (4x6 inch @ 300 DPI)" },
        signature: { width: 140, height: 60, minKb: 4, maxKb: 30, label: "NTA Signature" }
      }
    }
  },

  states: {
    andhra_pradesh: { name: "Andhra Pradesh (APPSC)", capital: "Amaravati", query: "amaravati,architecture,india", p: [275, 354, 20, 50], s: [275, 118, 10, 30] },
    arunachal_pradesh: { name: "Arunachal Pradesh (APPSC)", capital: "Itanagar", query: "itanagar,monastery,arunachal", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    assam: { name: "Assam (APSC / Police)", capital: "Dispur (Guwahati)", query: "guwahati,brahmaputra,assam", p: [413, 531, 20, 50], s: [413, 177, 10, 30] },
    bihar: { name: "Bihar (BPSC / BSSC)", capital: "Patna", query: "patna,heritage,bihar", p: [350, 450, 15, 25], s: [350, 150, 10, 20] },
    chhattisgarh: { name: "Chhattisgarh (CGPSC / Vyapam)", capital: "Raipur", query: "raipur,city,chhattisgarh", p: [350, 450, 20, 50], s: [300, 120, 10, 20] },
    goa: { name: "Goa (Goa PSC)", capital: "Panaji", query: "panaji,goa,church", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    gujarat: { name: "Gujarat (GPSC / GSSSB)", capital: "Gandhinagar", query: "gandhinagar,gujarat,architecture", p: [350, 450, 10, 50], s: [350, 150, 10, 50] },
    haryana: { name: "Haryana (HPSC / HSSC)", capital: "Chandigarh", query: "chandigarh,city,architecture", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    himachal_pradesh: { name: "Himachal Pradesh (HPPSC)", capital: "Shimla", query: "shimla,hills,himachal", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    jharkhand: { name: "Jharkhand (JPSC / JSSC)", capital: "Ranchi", query: "ranchi,jharkhand,waterfall", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    karnataka: { name: "Karnataka (KPSC / KSP)", capital: "Bengaluru", query: "bengaluru,vidhana-soudha,karnataka", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    kerala: { name: "Kerala (Kerala PSC Thulasi)", capital: "Thiruvananthapuram", query: "thiruvananthapuram,kerala,temple", p: [150, 200, 20, 30, true], s: [150, 100, 10, 30] },
    madhya_pradesh: { name: "Madhya Pradesh (MPPSC / MPESB)", capital: "Bhopal", query: "bhopal,lake,madhyapradesh", p: [350, 450, 20, 100, true], s: [300, 120, 10, 50] },
    maharashtra: { name: "Maharashtra (MPSC)", capital: "Mumbai", query: "mumbai,gateway-of-india,maharashtra", p: [275, 354, 20, 50], s: [275, 118, 10, 20] },
    manipur: { name: "Manipur (Manipur PSC)", capital: "Imphal", query: "imphal,manipur,landscape", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    meghalaya: { name: "Meghalaya (MPSC)", capital: "Shillong", query: "shillong,meghalaya,hills", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    mizoram: { name: "Mizoram (Mizoram PSC)", capital: "Aizawl", query: "aizawl,mizoram,cityscape", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    nagaland: { name: "Nagaland (NPSC)", capital: "Kohima", query: "kohima,nagaland,landscape", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    odisha: { name: "Odisha (OPSC / OSSSC)", capital: "Bhubaneswar", query: "bhubaneswar,temple,odisha", p: [350, 450, 20, 100], s: [280, 120, 10, 50] },
    punjab: { name: "Punjab (PPSC / PSSSB)", capital: "Chandigarh", query: "chandigarh,punjab,architecture", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    rajasthan: { name: "Rajasthan (RPSC / RSMSSB)", capital: "Jaipur", query: "jaipur,hawa-mahal,rajasthan", p: [350, 450, 50, 100], s: [280, 120, 20, 50] },
    sikkim: { name: "Sikkim (SPSC)", capital: "Gangtok", query: "gangtok,sikkim,himalayas", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    tamil_nadu: { name: "Tamil Nadu (TNPSC / TNUSRB)", capital: "Chennai", query: "chennai,marina,tamilnadu", p: [275, 354, 20, 50, true], s: [275, 118, 10, 20] },
    telangana: { name: "Telangana (TGPSC / Police)", capital: "Hyderabad", query: "hyderabad,charminar,telangana", p: [350, 450, 20, 50], s: [280, 120, 10, 30] },
    tripura: { name: "Tripura (TPSC)", capital: "Agartala", query: "agartala,palace,tripura", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    uttar_pradesh: { name: "Uttar Pradesh (UPPSC / UPSSSC)", capital: "Lucknow", query: "lucknow,heritage,uttarpradesh", p: [350, 450, 20, 50], s: [350, 150, 10, 30] },
    uttarakhand: { name: "Uttarakhand (UKPSC / UKSSSC)", capital: "Dehradun", query: "dehradun,uttarakhand,mountains", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    west_bengal: { name: "West Bengal (WBPSC / WBP / KP)", capital: "Kolkata", query: "kolkata,victoria-memorial,westbengal", p: [276, 354, 20, 50], s: [472, 118, 10, 20] }
  },

  uts: {
    delhi: { name: "Delhi NCT (DSSSB)", capital: "New Delhi", query: "new-delhi,india-gate,capital", p: [413, 531, 40, 100], s: [280, 120, 10, 40] },
    jammu_kashmir: { name: "Jammu & Kashmir (JKSSB / JKPSC)", capital: "Srinagar", query: "srinagar,dal-lake,kashmir", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    ladakh: { name: "Ladakh (LAHDSSRB)", capital: "Leh", query: "leh,ladakh,monastery", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    chandigarh_ut: { name: "Chandigarh (Admin Recruitment)", capital: "Chandigarh", query: "chandigarh,modern,architecture", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    puducherry: { name: "Puducherry (Puducherry PSC)", capital: "Pondicherry", query: "pondicherry,french-quarter,coastal", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    andaman_nicobar: { name: "Andaman & Nicobar (Admin)", capital: "Port Blair", query: "port-blair,cellular-jail,andaman", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    dadra_nagar_daman_diu: { name: "DNH & DD (Administration)", capital: "Daman", query: "daman,fort,coastal,india", p: [350, 450, 20, 50], s: [280, 120, 10, 20] },
    lakshadweep: { name: "Lakshadweep (Administration)", capital: "Kavaratti", query: "lakshadweep,island,beach,india", p: [350, 450, 20, 50], s: [280, 120, 10, 20] }
  }
};

/** Helper: normalize state/UT entry into full spec object */
function normalizeStateSpec(entry) {
  const [pw, ph, pMin, pMax, pNameDate] = entry.p;
  const [sw, sh, sMin, sMax] = entry.s;
  return {
    name: entry.name,
    capitalQuery: entry.query,
    capitalName: entry.capital,
    specs: {
      photo: { width: pw, height: ph, minKb: pMin, maxKb: pMax, allowNameDate: !!pNameDate, label: entry.name + " Photo" },
      signature: { width: sw, height: sh, minKb: sMin, maxKb: sMax, label: entry.name + " Signature" }
    }
  };
}
