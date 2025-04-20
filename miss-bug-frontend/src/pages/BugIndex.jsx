import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function BugIndex() {
    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    async function loadBugs() {
        const bugs = await bugService.query(filterBy)
        setBugs(bugs)
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Succesfully!')
            setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }

    async function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?') || 'No description'
        }
        try {
            const savedBug = await bugService.save(bug)
            console.log('Added Bug', savedBug)
            setBugs(prevBugs => [...prevBugs, savedBug])
            showSuccessMsg('Bug added')
        } catch (err) {
            console.log('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }

    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        try {

            const savedBug = await bugService.save(bugToSave)
            console.log('Updated Bug:', savedBug)
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }

    function downloadPdf() {
        const doc = new jsPDF()
    
        doc.text('Bug Report ', 14, 14)
    
        const bugData = bugs.map(bug => [
            bug._id,
            bug.title,
            bug.severity,
            bug.createdAt ? new Date(bug.createdAt).toLocaleDateString() : '',
            bug.description || ''
        ])
    
        autoTable(doc, { 
            head: [['ID', 'Title', 'Severity', 'Created At', 'Description']],
            body: bugData,
            startY: 20,
        })
    
    
        doc.save('bug-report.pdf')
    }

    function handleChange(ev) {
        const { name, value } = ev.target
        setFilterBy(prev => ({ ...prev, [name]: value }))
    }

    return (
        <section >
            <h3>Bugs App</h3>
            <main>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <input
                    type="text"
                    placeholder="Search bugs..."
                    value={filterBy.txt}
                    onChange={handleChange}
                />
                <select
                    value={filterBy.severity}
                    onChange={handleChange}
                    //onBlur={loadBugs}
                >
                    <option value="">All Severities</option>
                    <option value="1">1 or less</option>
                    <option value="2">2 or less</option>
                    <option value="3">3 or less</option>
                    <option value="4">4 or less</option>
                </select>
                <select
                    value={filterBy.sortBy}
                    onChange={handleChange}
                >
                    <option value="title">Sort by Title</option>
                    <option value="severity">Sort by Severity</option>
                    <option value="createdAt">Sort by Created At</option>
                </select>

                <select
                    value={filterBy.sortDir}
                    onChange={handleChange}
                >
                    <option value="1">Ascending</option>
                    <option value="-1">Descending</option>
                </select>
                <button onClick={downloadPdf}>Download PDF 📄</button>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </section>
    )
}
