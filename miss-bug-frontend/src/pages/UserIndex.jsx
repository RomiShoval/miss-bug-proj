import { useState, useEffect } from 'react'
import { userService } from '../services/user.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

export function UserIndex() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const users = await userService.query()
      console.log(users)
      setUsers(users)
    } catch (err) {
      console.log('Error loading users', err)
    }
  }

  async function onRemoveUser(userId) {
    try {
      await userService.remove(userId)
      setUsers(prev => prev.filter(user => user._id !== userId))
      showSuccessMsg('User removed')
    } catch (err) {
      console.log('Error from onRemoveUser ->', err)
      showErrorMsg('Cannot remove user')
    }
  }

  async function onAddUser() {
    const user = {
      fullname: prompt('Full name?'),
      username: prompt('Username?'),
      password: prompt('Password?'),
      score: +prompt('Score?') || 0,
    }
    try {
      const savedUser = await userService.save(user)
      setUsers(prev => [...prev, savedUser])
      showSuccessMsg('User added')
    } catch (err) {
      console.log('Error from onAddUser ->', err)
      showErrorMsg('Cannot add user')
    }
  }

  async function onEditUser(user) {
    const score = +prompt('New score?', user.score)
    const userToSave = { ...user, score }
    try {
      const savedUser = await userService.save(userToSave)
      setUsers(prev => prev.map(u => (u._id === savedUser._id ? savedUser : u)))
      showSuccessMsg('User updated')
    } catch (err) {
      console.log('Error from onEditUser ->', err)
      showErrorMsg('Cannot update user')
    }
  }

  return (
    <section>
      <h2>Users</h2>
      <button onClick={onAddUser}>Add User</button>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.fullname} ({user.username}) - Score: {user.score}
            <button onClick={() => onRemoveUser(user._id)}>Remove</button>
            <button onClick={() => onEditUser(user)}>Edit</button>
          </li>
        ))}
      </ul>
    </section>
  )
}
