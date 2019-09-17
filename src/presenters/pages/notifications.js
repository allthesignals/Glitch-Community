import React from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, SegmentedButton, Icon, Popover, Actions, Loader } from '@fogcreek/shared-components'
import Layout from 'Components/layout'
import { useCurrentUser } from 'State/current-user'
import { actions, useNotifications } from 'State/remote-notifications'

// TODO: do in router instead of in component
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
  const { status, notifications, nextPage } = useNotifications()
  const [limit, setLimit]
  const dispatch = useDispatch()
  
  // TODO: this can be done in router
  const activeFilter = parse(search, 'activeFilter') || "all"
  
  const setActiveFilter = (filter) => {
    history.push(`/notifications?activeFilter=${filter}`);
  };
 
  const filteredNotifications = React.useMemo(() => {
    if (filter === 'all') 
  }, [notifications, activeFilter])
  
  
  return (
    <>
      <header>
        <h2>
          Notifications
          {" "}
          <Button as="a" href="/settings#privacy-and-notifications">Edit notification settings</Button>
        </h2>
        <SegmentedButton variant="secondary" size="small" options={filterOptions} value={activeFilter} onChange={setActiveFilter} />
        {status === 'loading' && <Loader />}
        {status === 'ready' && notifications.length === 0 && (
          <p>No notifications</p>
        )}
        
        <ul>
          {notifications.map(n => (
            <li ket={n.id}>
              <Notification data={n} />
            </li>
          ))}
        </ul>
        {nextPage && <Button onClick={() => dispatch(actions.requestedMoreNotifications())}>Load More</Button>}
      </header>
    </>
  )
})

const NotificationsPageContainer = () => {
  const { currentUser } = useCurrentUser()
  return <Layout>{currentUser.login ? <NotificationsPage /> : <div/> }</Layout>
}