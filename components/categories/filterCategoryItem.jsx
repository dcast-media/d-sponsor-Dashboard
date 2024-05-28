import React, { useEffect } from "react";
import { trendingCategoryData } from "../../data/categories_data";
import Collection_category_filter from "../collections/collection_category_filter";
import CategoryItem from "./categoryItem";
import { useDispatch } from "react-redux";
// import { updateTrendingCategoryItemData } from "../../redux/counterSlice";
import {useChainContext} from "../../contexts/hooks/useChainContext";

const FilterCategoryItem = () => {
  const dispatch = useDispatch();
  const { setTrendingCategoryItemData } = useChainContext();

  useEffect(() => {
    setTrendingCategoryItemData(trendingCategoryData.slice(0, 8));
  }, []);

  return (
    <div>
      {/* <!-- Filter --> */}
      <Collection_category_filter />
      <CategoryItem />
    </div>
  );
};

export default FilterCategoryItem;
