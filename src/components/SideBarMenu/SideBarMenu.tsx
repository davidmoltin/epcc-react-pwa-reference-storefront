import React from "react";
import 'react-pro-sidebar/dist/css/styles.css';
import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

export const SideBarMenu: React.FC = () => {

    return (

        <ProSidebar>
        <SidebarHeader>
           Header Info
        </SidebarHeader>
        <SidebarContent>
        <Menu iconShape="square">
            <MenuItem>Dashboard</MenuItem>
            <SubMenu title="Components">
            <MenuItem>Component 1</MenuItem>
            <MenuItem>Component 2</MenuItem>
            </SubMenu>
        </Menu>
        </SidebarContent>
        <SidebarFooter>
            Always a Footer
        </SidebarFooter>
        </ProSidebar>
      );
    };
        