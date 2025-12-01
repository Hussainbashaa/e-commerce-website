import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCategoryProducts = createAsyncThunk(
  "category/fetchCategoryProducts",
  async (category, { rejectWithValue }) => {
    try {
      console.log("Fetching category:", category);
      const res = await axios.get(
        `https://e-commerce-shop-rho-six.vercel.app/api/products/search?query=${category}`
      );
      console.log("Fetched category data:", res.data.products);
      return res.data.products || [];
    } catch (err) {
      console.error("Error fetching category:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to load category products"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    selectedCategory: null,
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
    clearCategory: (state) => {
      state.selectedCategory = null;
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryProducts.pending, (state) => {
        state.status = "loading";
        state.items = [];
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setCategory, clearCategory } = categorySlice.actions;
export default categorySlice.reducer;
