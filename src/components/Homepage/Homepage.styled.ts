import { Paper } from "@mui/material";
import { styled } from "styled-components";

export const HomepageContainer = styled.div`
  padding: 1.5rem;
  background: #dce3ee;
  min-height: 100vh;
`;

export const WelcomeSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  .welcome-content {
    position: relative;
    z-index: 1;
  }

  .greeting-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .sparkle-icon {
    font-size: 2rem;
    color: #ffd700;
    animation: sparkle 2s ease-in-out infinite;
  }

  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.1) rotate(180deg); opacity: 0.8; }
  }

  .greeting-text {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(45deg, #ffffff, #f0f8ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }

  .date-filter-wrapper {
    position: relative;
    z-index: 1;
  }

  .date-range-display {
    margin-top: 1rem;
  }

  .date-chip {
    background: rgba(255, 255, 255, 0.2) !important;
    color: white !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
    backdrop-filter: blur(10px);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    
    .greeting-text {
      font-size: 2rem;
    }
    
    .greeting-section {
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
  }
`;

export const ModernCard = styled(Paper)`
  border-radius: 16px !important;
  background: white !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  }

  &.balance-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    color: white;
    
    .balance-content {
      padding: 2rem;
      text-align: center;
    }
    
    .balance-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      
      h3 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
      }
    }
    
    .balance-icon {
      font-size: 1.5rem;
    }
    
    .balance-amount {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      
      &.positive {
        color: #4ade80;
      }
      
      &.negative {
        color: #f87171;
      }
    }
    
    .balance-description {
      font-size: 1rem;
      opacity: 0.9;
      margin-bottom: 1rem;
    }
    
    .balance-note {
      opacity: 0.7;
    }
  }

  &.empty-state {
    .empty-content {
      padding: 3rem;
      text-align: center;
      color: #6b7280;
      
      .empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
      }
      
      h3 {
        margin-bottom: 0.5rem;
        color: #374151;
      }
      
      p {
        margin: 0;
        opacity: 0.8;
      }
    }
  }
`;

export const StatsCard = styled(Paper)`
  border-radius: 16px !important;
  background: white !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
  cursor: pointer;
  padding: 1.5rem !important;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    opacity: 0.1;
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
    
    &::before {
      transform: scale(1.2);
    }
    
    .arrow-icon {
      transform: translateX(4px);
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    
    &.personal {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    
    &.shared {
      background: linear-gradient(135deg, #f093fb, #f5576c);
      color: white;
    }
    
    &.owe {
      background: linear-gradient(135deg, #ffecd2, #fcb69f);
      color: #d97706;
    }
    
    &.owed {
      background: linear-gradient(135deg, #a8edea, #fed6e3);
      color: #059669;
    }
  }

  .arrow-icon {
    color: #9ca3af;
    transition: all 0.3s ease;
  }

  .card-content {
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.5rem;
    }
    
    .amount {
      font-size: 1.75rem;
      font-weight: 800;
      color: #111827;
      margin-bottom: 0.25rem;
      
      &.owe-amount {
        color: #dc2626;
      }
      
      &.owed-amount {
        color: #059669;
      }
    }
    
    .card-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
    }
  }

  &.personal-card::before {
    background: linear-gradient(135deg, #667eea, #764ba2);
  }
  
  &.shared-card::before {
    background: linear-gradient(135deg, #f093fb, #f5576c);
  }
  
  &.owe-card::before {
    background: linear-gradient(135deg, #ffecd2, #fcb69f);
  }
  
  &.owed-card::before {
    background: linear-gradient(135deg, #a8edea, #fed6e3);
  }
`;

export const ChartCard = styled(Paper)`
  border-radius: 16px !important;
  background: white !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
  height: 500px;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
  }

  .chart-header {
    padding: 1.5rem 1.5rem 0;
    border-bottom: 1px solid #f3f4f6;
    margin-bottom: 1rem;
  }

  .chart-title-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
    
    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }
  }

  .chart-icon {
    font-size: 1.5rem;
    color: #667eea;
  }

  .chart-subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    margin: 0;
  }

  .chart-content {
    flex: 1;
    padding: 0 1.5rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .category-content {
    flex: 1;
    padding: 0 1.5rem 1.5rem;
    overflow-y: auto;
  }
`;

// Legacy components for backward compatibility
export const Item = styled(Paper)(({ }) => ({
  borderRadius: '16px',
  background: '#fff',
  minWidth: '100px',
  minHeight: '480px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

export const SmallBox = styled(Paper)(({ }) => ({
  borderRadius: '16px',
  minWidth: '100px',
  minHeight: '150px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

export const BigBox = styled(Paper)(({ }) => ({
  borderRadius: '16px',
  width: '100%',
  '&.MuiPaper-root': {
    background: '#fff',
  },
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  border: '1px solid rgba(0, 0, 0, 0.05)',
}));

export const BoxContent = styled.div`
  padding: 20px;
`;

// Global styles for the homepage
export const GlobalStyles = styled.div`
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 0;
    gap: 1rem;
  }

  .loading-text {
    color: #6b7280 !important;
  }

  .stats-row {
    margin-bottom: 2rem;
  }

  .balance-row {
    margin-bottom: 2rem;
  }

  .chart-row {
    margin-bottom: 2rem;
  }

  .empty-state-row {
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .stats-row .col-12 {
      margin-bottom: 1rem;
    }
    
    .chart-row .col-12 {
      margin-bottom: 1rem;
    }
  }
`;
