import React from "react";
import './Home.css';


const Home = () => {
  return (
    <div className="home-content">
      <h2>💲 Try to request a salary raise. Empower the people! 💲</h2>
      <p>Team up to increase your all salaries!</p>
      <img src="https://cloudflare-ipfs.com/ipfs/QmetsaWYSqkxxiXPEsC8wyAHtvW9WfQ9EWXNHRjS2r1BmG" />
      <div className="content-text">
        <p>We all know that.</p>
        <ul>
          <li>- You always give full performance.</li>
          <li>- You never complain.</li>
          <li>- Your results always exceed the requirements.</li>
        </ul>
        <p>
          And yet. When you ask for more money, you always get the same answer: NO.
        </p>
        <p>
          You are annoyed by this? Then start here right now. 
          You can immediately join forces with others to stop the bosses of this world.
        </p>
        <p>
          Try to increase your own salary by throwing arguments at your boss until he can't say no anymore.
        </p>
      </div>
    </div>
  );
};

export default Home;