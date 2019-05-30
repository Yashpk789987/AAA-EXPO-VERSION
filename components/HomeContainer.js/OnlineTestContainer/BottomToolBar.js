import React  from 'react'
import { View } from 'react-native'
import { Icon } from 'native-base'
import BottomNavigation, {
    FullTab
  } from 'react-native-material-bottom-navigation'
   
  export default class BottomToolBar extends React.Component {
    tabs = [
      {
        key: 'games',
        icon: 'bookmark',
        label: 'Bookmarks',
        barColor: this.props.toolbar_background_color,
        
      },
      {
        key: 'music',
        icon: 'fastforward',
        label: 'Move To ',
        barColor: this.props.toolbar_background_color,
        
      },
      {
        key: 'movies-tv',
        icon: 'share-alt',
        label: 'share',
        barColor: this.props.toolbar_background_color,
      },
    ]
   
    renderIcon = icon => ({ isActive }) => (
      <Icon size={24} style = {{ color : 'white' }} name={icon} />
    )
   
    renderTab = ({ tab, isActive }) => (
      <FullTab
        isActive={isActive}
        key={tab.key}
        label={tab.label}
        renderIcon={this.renderIcon(tab.icon)}
      />
    )
   
    render() {
      return (
        
          <BottomNavigation
            onTabPress={newTab => this.setState({ activeTab: newTab.key })}
            renderTab={this.renderTab}
            tabs={this.tabs}
          />
        
      )
    }
  }