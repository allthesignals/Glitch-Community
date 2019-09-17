import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { Button, SegmentedButton, Icon, Popover, Actions } from '@fogcreek/shared-components'
import Layout from 'Components/layout'
import { useCurrentUser } from 'State/current-user'


const NotificationsPage = withRouter(({ query }) => {
  const activeFilter
  
  const setActiveFilter = (filter) => {
    history.push(`/search?q=${encodeURIComponent(query)}&activeFilter=${filter}`);
  };
  
  
  return (
    <>
      <header>
        <h2>
          Notifications
          {" "}
          <Button as="a" href="/settings#privacy-and-notifications">Edit notification settings</Button>
        </h2>
        <SegmentedButton 
      </header>
    </>
  )
})

const NotificationsPageContainer = () => {
  const { currentUser } = useCurrentUser()
  return <Layout>{currentUser.login ? <NotificationsPage /> : <div/> }</Layout>
}