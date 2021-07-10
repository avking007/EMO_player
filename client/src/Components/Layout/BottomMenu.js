import { Tab, Tabs, withStyles } from '@material-ui/core';
import { Home, Favorite, History } from '@material-ui/icons';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const BottomMenu = () => {
    
    const CustomTabs = withStyles({
        root: {
            background: "#191414",
            position: "sticky",
            bottom: "0",
            padding: 0,
            width: "100%",
            zIndex: 1300,
        },
        indicator: {
            display: "none",
        },
    })(Tabs);

    const CustomTab = withStyles({
        root: {
            color: "#1db954",
            fontWeight: "bold",
            fontSize: ".75rem",
            margin: 0,

            "&:hover": {
                color: "#e4e6eb",
                textDecoration: "none",
                opacity: 1,
            },
            "&$selected": {
                color: "#b3b3b3",
            },
            "&:focus": {
                color: "#b3b3b3",
            },
        },

        selected: {},
    })(Tab);
    
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, value) => {
        setTabValue(value);
    }
    return (
        <CustomTabs
            value={tabValue}
            onChange={handleChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
        >
            <CustomTab
                icon={<Home />}
                aria-label="Home"
                component={Link}
                to="/home"
                label="Home"
            />

            <CustomTab
                icon={<Favorite />}
                aria-label="Liked"
                component={Link}
                to="/liked"
                label="Liked"
            />
            <CustomTab
                icon={<History />}
                aria-label="History"
                component={Link}
                to="/history"
                label="History"
            />
        </CustomTabs>
    );
};

export default BottomMenu
