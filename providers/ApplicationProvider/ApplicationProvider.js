import React, {useMemo, useState} from "react";
import ApplicationContext from "../../contexts/ApplicationContext";

const ApplicationProvider = ({ children }) => {
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [trendingCategoryItemData, setTrendingCategoryItemData] = useState([]);

    const value = useMemo(() => {
        return {
            isBidModalOpen: isBidModalOpen,
            setIsBidModalOpen: setIsBidModalOpen,
            isBuyModalOpen: isBuyModalOpen,
            setIsBuyModalOpen: setIsBuyModalOpen,
            setTrendingCategoryItemData,
            trendingCategoryItemData,
            sortedTrendingCategoryItemData: trendingCategoryItemData.sort((a, b) => a.price - b.price),
        };
    });

    return (
        <ApplicationContext.Provider value={value}>
            {children}
        </ApplicationContext.Provider>
    );
};

export default ApplicationProvider;
