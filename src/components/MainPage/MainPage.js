import logo from './logo.svg';
import './MainPage.css';
import '../../styles.css';
import { Link } from 'react-router-dom';

function MainPage(props)
{
    return (
        <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
              {/* <button className="btn" onClick={props.set} >Go to Scrum Board Page</button> */}
              <Link to="/board" className="btn center">Go to Scrum Board Page</Link>
        </header>
    )
}

export default MainPage;