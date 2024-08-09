import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ItemData {
  sortPrice?: number;
  addDate?: number;
  verified?: boolean;
  nfsw?: boolean;
  lazyMinted?: boolean;
  trending?: boolean;
  top?: boolean;
  recent?: boolean;
  category?: string;
  blockchain?: string;
  postDate?: string;
}

interface CounterState {
  mblMenu: boolean;
  dropdown: boolean;
  collection_activity_item_data: ItemData[];
  trendingCategoryItemData: ItemData[];
  sortedtrendingCategoryItemData: ItemData[];
  collectiondata: ItemData[];
  sortedCollectionData: ItemData[];
  renkingData: ItemData[];
  filteredRenkingData: ItemData[];
  walletModal: boolean;
  bidsModal: boolean;
  buyModal: boolean;
  propartiesModalValue: boolean;
  trendingCategorySorText: string;
}

const initialState: CounterState = {
  mblMenu: false,
  dropdown: false,
  collection_activity_item_data: [],
  trendingCategoryItemData: [],
  sortedtrendingCategoryItemData: [],
  collectiondata: [],
  sortedCollectionData: [],
  renkingData: [],
  filteredRenkingData: [],
  walletModal: false,
  bidsModal: false,
  buyModal: false,
  propartiesModalValue: false,
  trendingCategorySorText: ""
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    openMblMenu: (state) => {
      state.mblMenu = true;
    },
    closeMblMenu: (state) => {
      state.mblMenu = false;
    },
    openDropdown: (state) => {
      state.dropdown = true;
    },
    closeDropdown: (state) => {
      state.dropdown = false;
    },
    handle_collection_activity_item_data: (state, action: PayloadAction<{ data: ItemData[] }>) => {
      state.collection_activity_item_data = action.payload.data;
    },
    walletModalShow: (state) => {
      state.walletModal = true;
    },
    walletModalhide: (state) => {
      state.walletModal = false;
    },
    bidsModalShow: (state) => {
      state.bidsModal = true;
    },
    bidsModalHide: (state) => {
      state.bidsModal = false;
    },
    buyModalShow: (state) => {
      state.buyModal = true;
    },
    buyModalHide: (state) => {
      state.buyModal = false;
    },
    showPropatiesModal: (state) => {
      state.propartiesModalValue = true;
    },
    closePropatiesModal: (state) => {
      state.propartiesModalValue = false;
    },
    updateTrendingCategoryItemData: (state, action: PayloadAction<ItemData[]>) => {
      state.trendingCategoryItemData = action.payload;
      state.sortedtrendingCategoryItemData = action.payload;
    },
    updatetrendingCategorySorText: (state, action: PayloadAction<string>) => {
      const sortText = action.payload;
      if (sortText === "Price: Low to High") {
        state.sortedtrendingCategoryItemData = [...state.trendingCategoryItemData]?.sort(
          (a, b) => (a.sortPrice ?? 0) - (b.sortPrice ?? 0)
        );
      } else if (sortText === "Price: high to low") {
        state.sortedtrendingCategoryItemData = [...state.trendingCategoryItemData]?.sort(
          (a, b) => (b.sortPrice ?? 0) - (a.sortPrice ?? 0)
        );
      } else if (sortText === "Recently Added") {
        state.sortedtrendingCategoryItemData = [...state.trendingCategoryItemData]?.sort(
          (a, b) => (a.addDate ?? 0) - (b.addDate ?? 0)
        );
      } else if (sortText === "Auction Ending Soon") {
        state.sortedtrendingCategoryItemData = [...state.trendingCategoryItemData]?.sort(
          (a, b) => (b.addDate ?? 0) - (a.addDate ?? 0)
        );
      } else {
        state.sortedtrendingCategoryItemData = state.trendingCategoryItemData;
      }
    },
    updateTrendingCategoryItemByInput: (state, action: PayloadAction<string>) => {
      const text = action.payload;
      if (text === "Verified Only") {
        state.sortedtrendingCategoryItemData = state.trendingCategoryItemData?.filter((item) => {
          return item.verified;
        });
      } else if (text === "NFSW Only") {
        state.sortedtrendingCategoryItemData = state.trendingCategoryItemData?.filter((item) => {
          return item.nfsw;
        });
      } else if (text === "Show Lazy Minted") {
        state.sortedtrendingCategoryItemData = state.trendingCategoryItemData?.filter((item) => {
          return item.lazyMinted;
        });
      } else {
        state.sortedtrendingCategoryItemData = state.trendingCategoryItemData;
      }
    },
    collectCollectionData: (state, action: PayloadAction<ItemData[]>) => {
      const data = action.payload;
      state.collectiondata = data;
      state.sortedCollectionData = data;
    },
    updateCollectionData: (state, action: PayloadAction<string>) => {
      const text = action.payload;
      if (text === "trending") {
        const tampItem = state.collectiondata.filter((item) => item.trending);
        state.sortedCollectionData = tampItem;
      }
      if (text === "top") {
        const tampItem = state.collectiondata.filter((item) => item.top);
        state.sortedCollectionData = tampItem;
      }
      if (text === "recent") {
        const tampItem = state.collectiondata.filter((item) => item.recent);
        state.sortedCollectionData = tampItem;
      }
    },
    collectRenkingData: (state, action: PayloadAction<ItemData[]>) => {
      state.renkingData = action.payload;
      state.filteredRenkingData = action.payload;
    },
    updateRenkingData: (state, action: PayloadAction<string>) => {
      const text = action.payload;
      let tempItem = state.renkingData.filter((item) => item.category === text);
      if (text === "All") {
        tempItem = state.renkingData;
      }
      state.filteredRenkingData = tempItem;
    },
    updateRenkingDataByBlockchain: (state, action: PayloadAction<string>) => {
      const text = action.payload;
      let tempItem = state.renkingData.filter((item) => item.blockchain === text);
      if (text === "All") {
        tempItem = state.renkingData;
      }
      state.filteredRenkingData = tempItem;
    },
    updateRenkingDataByPostdate: (state, action: PayloadAction<string>) => {
      const text = action.payload;
      let tempItem = state.renkingData.filter((item) => item.postDate === text);
      if (text === "All Time" || text === "Last Year") {
        tempItem = state.renkingData;
      }
      state.filteredRenkingData = tempItem;
    }
  }
});

export const {
  openMblMenu,
  closeMblMenu,
  openDropdown,
  closeDropdown,
  walletModalShow,
  walletModalhide,
  bidsModalShow,
  bidsModalHide,
  buyModalShow,
  buyModalHide,
  showPropatiesModal,
  closePropatiesModal,
  updatetrendingCategorySorText,
  updateTrendingCategoryItemData,
  updateTrendingCategoryItemByInput,
  collectCollectionData,
  updateCollectionData,
  collectRenkingData,
  updateRenkingData,
  updateRenkingDataByBlockchain,
  updateRenkingDataByPostdate
} = counterSlice.actions;

export default counterSlice.reducer;
