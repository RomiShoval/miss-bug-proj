import img from '../assets/img/logo.png'

export function Home() {
  return (
    <section className='home'>
      <h1>Welcome to Bug Tracker</h1>
      <p>Track bugs, manage users, and more.</p>
      <img src={img} />
      {/* <Link to="/user">Go to Users</Link> */}
    </section>
  )
}
