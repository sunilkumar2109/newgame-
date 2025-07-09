import React, { useState } from 'react';
import { auth } from '../firebase';

const Dashboard = ({ user }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const rewards = [
    {
      id: 1,
      title: "PUBG MOBILE",
      amount: "$10.00",
      task: "Reach level 20",
      type: "GAME",
      imageUrl: "https://images.ctfassets.net/vfkpgemp7ek3/1104843306/ef4338ea8a96a113ff97e85f13e2e9c5/pubg-mobile-hits-3-billion-lifetime-revenue.jpg",
      gameLink: "https://store.steampowered.com/app/578080/PUBG_BATTLEGROUNDS/",
      timeSpent: "2 hours",
      rewardEarned: "$8.50",
      progress: 65,
      description: "PlayerUnknown's Battlegrounds is a player versus player shooter game in which up to one hundred players fight in a battle royale."
    },
    {
      id: 2,
      title: "Rise of Kingdoms",
      amount: "$150.00",
      task: "Reach level 11",
      type: "GAME",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn4Q3qKx7R-KcuttnjXeRbbUMbIBCan13RSg&s",
      gameLink: "https://rok.lilith.com/",
      timeSpent: "5 hours",
      rewardEarned: "$120.00",
      progress: 80,
      description: "Rise of Kingdoms is a real-time strategy game that takes you through the evolution of civilization."
    },
    {
      id: 3,
      title: "8 Ball Pool",
      amount: "$90.00",
      task: "Complete a task",
      type: "GAME",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Eight_Ball_Rack_2005_SeanMcClean.jpg",
      gameLink: "https://www.miniclip.com/games/8-ball-pool/",
      timeSpent: "1 hour",
      rewardEarned: "$45.00",
      progress: 50,
      description: "8 Ball Pool is a mobile game based on pool, developed and published by Miniclip."
    },
    {
      id: 4,
      title: "Subway Surfers",
      amount: "$50.00",
      task: "Reach level 35",
      type: "APP",
      imageUrl: "https://i.pinimg.com/736x/5e/06/06/5e0606fa24129d51e2fda7608e9b079a.jpg",
      gameLink: "https://poki.com/en/g/subway-surfers",
      timeSpent: "3 hours",
      rewardEarned: "$32.50",
      progress: 65,
      description: "Subway Surfers is an endless runner mobile game co-developed by Kiloo and SYBO Games."
    },
    {
      id: 5,
      title: "OSN",
      amount: "$10.00",
      task: "Complete a task",
      type: "APP",
      imageUrl: "https://www.marketjs.com/case-study/osn-on-the-run-html5-game-for-a-tv-network/image3.jpg",
      gameLink: "https://osn.com/",
      timeSpent: "30 minutes",
      rewardEarned: "$5.00",
      progress: 50,
      description: "OSN is a premium entertainment platform offering a wide range of TV shows and movies."
    },
    {
      id: 6,
      title: "PUBG PC",
      amount: "$100.00",
      task: "Reach level 25",
      type: "GAME",
      imageUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/1ab55ce84484630645bdb49b383ebaee5412391b/ss_1ab55ce84484630645bdb49b383ebaee5412391b.1920x1080.jpg?t=1746590920",
      gameLink: "https://www.pubg.com/",
      timeSpent: "4 hours",
      rewardEarned: "$75.00",
      progress: 75,
      description: "PlayerUnknown's Battlegrounds PC version with enhanced graphics and gameplay."
    }
  ];

  const handleLogout = () => {
    auth.signOut();
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const handleStartPlaying = () => {
    if (selectedGame && selectedGame.gameLink) {
      window.open(selectedGame.gameLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">REWARDS</h1>
        
         {user && (
            <div className="welcome-message">
              Welcome, <span>{user.displayName || user.email}</span>
            </div>
        )}

        
      </div>
      
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
      
      <div className="rewards-grid">
        {rewards.map((reward) => (
          <div 
            key={reward.id} 
            className="reward-card"
            onClick={() => handleGameClick(reward)}
          >
            <img src={reward.imageUrl} alt={reward.title} className="reward-image" />
            <div className="type-badge">{reward.type}</div>
            
            <div className="reward-card-overlay">
              <h4>{reward.title}</h4>
              <p>Task: {reward.task}</p>
              <p>Progress: {reward.progress}%</p>
              <div className="progress-container-hover">
                <div 
                  className="progress-bar-hover" 
                  style={{ width: `${reward.progress}%` }}
                ></div>
              </div>
              <p>Reward: {reward.amount}</p>
            </div>
          </div>
        ))}
      </div>
      
      {showDetail && selectedGame && (
        <div className="game-detail-view">
          <div className="game-detail-content">
            <button className="close-detail-btn" onClick={closeDetail}>✕</button>
            
            <div className="game-detail-header">
              <img src={selectedGame.imageUrl} alt={selectedGame.title} className="game-detail-icon" />
              <div>
                <h2 className="game-detail-title">{selectedGame.title}</h2>
                <div className="type-badge">{selectedGame.type}</div>
              </div>
            </div>
            
            <div className="reward-amount">{selectedGame.amount}</div>
            <p className="reward-subtitle">{selectedGame.task}</p>
            
            <div className="game-detail-info">
              <p><strong>Time Spent:</strong> {selectedGame.timeSpent}</p>
              <p><strong>Reward Earned:</strong> {selectedGame.rewardEarned}</p>
              <p><strong>Progress:</strong></p>
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${selectedGame.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="game-detail-info">
              <p><strong>Description:</strong></p>
              <p>{selectedGame.description}</p>
            </div>
            
            <button 
              className="start-playing-btn" 
              onClick={handleStartPlaying}
            >
              Start Playing
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;