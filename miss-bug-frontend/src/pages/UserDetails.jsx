import { useEffect, useState } from 'react'
import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function UserDetails() {
    const [userBugs, setUserBugs] = useState([])
    const user = userService.getLoggedinUser()

    useEffect(() => {
        if (user) {
            loadBugs()
        }
    }, [])

    async function loadBugs() {
        const allBugs = await bugService.query()
        const userCreatedBugs = allBugs.filter(bug => bug.creator._id === user._id)
        setUserBugs(userCreatedBugs)
    }

    if (!user) return <div>Please login</div>

    return (
        <section>
            <h2>{user.fullname}'s Profile</h2>
            <h3>Your Bugs:</h3>
            <BugList bugs={userBugs} onRemoveBug={() => {}} onEditBug={() => {}} />
        </section>
    )
}