import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { Button, SegmentedButton, Icon, Popover, Actions } from '@fogcreek/shared-components'
import Layout from 'Components/layout'
import { useCurrentUser } from 'State/current-user'

const parse = (search, name) => {
  const params = new URLSearchParams(search);
  return params.get(name);
};

const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'remixes', label: 'Remixes' },
  { id: 'collections', label: 'Collections'},
  { id: 'users', label: 'Users'}
]

const NotificationsPage = withRouter(({ search }) => {
  // TODO: this can be done in router
  const activeFilter = parse(search, 'activeFilter') || "all" // all | remixes | collections | users 
  
  const setActiveFilter = (filter) => {
    history.push(`/notifications?activeFilter=${filter}`);
  };
  
  
  return (
    <>
      <header>
        <h2>
          Notifications
          {" "}
          <Button as="a" href="/settings#privacy-and-notifications">Edit notification settings</Button>
        </h2>
        <SegmentedButton />
      </header>
    </>
  )
})

const NotificationsPageContainer = () => {
  const { currentUser } = useCurrentUser()
  return <Layout>{currentUser.login ? <NotificationsPage /> : <div/> }</Layout>
}