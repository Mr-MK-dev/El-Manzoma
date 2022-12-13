let units = [
  {
    ID: 5,
    emptySlots: [
      { category: "writer", count: 3 },
      { category: "driver", count: 3 },
      { category: "normal", count: 2 }
    ],
    isSpecial: 1,
    extraProfitType: "high",
    isHardWord: 0
  },
  {
    ID: 2,
    emptySlots: [
      { category: "writer", count: 5 },
      { category: "driver", count: 1 },
      { category: "normal", count: 7 }
    ],
    isSpecial: 0,
    extraProfitType: "high",
    isHardWord: 1
  },
  {
    ID: 3,
    emptySlots: [
      { category: "writer", count: 2 },
      { category: "driver", count: 7 },
      { category: "normal", count: 2 }
    ],
    isSpecial: 0,
    extraProfitType: "mid",
    isHardWord: 0
  },
  {
    ID: 4,
    emptySlots: [
      { category: "writer", count: 1 },
      { category: "driver", count: 3 },
      { category: "normal", count: 2 }
    ],
    isSpecial: 1,
    extraProfitType: "low",
    isHardWord: 0
  }
];

let candidates = [
  //should allocate to Unit 5
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  // should be allocated  to unit 5 based on preunits
  {
    Id: 1,
    category: "writer",
    preunits: [2, 3, 4, 8],
    recommendation: null,
    request: null
  },
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  {
    Id: 1,
    category: "writer",
    preunits: [1, 9, 7, 8],
    recommendation: { recommendationId: 1, toUnitId: 5 },
    request: null
  },
  // should allocate to Unit 5 by request
  {
    Id: 1,
    category: "writer",
    preunits: [2, 3, 6],
    recommendation: null,
    request: { reqId: 1, toUnitId: 5 }
  }
];
