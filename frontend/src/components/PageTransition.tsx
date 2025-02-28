import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState<any>(children);
  const [transitionStage, setTransitionStage] = useState('page-transition-enter');

  useEffect(() => {
    if (displayChildren && displayChildren.props && location.pathname !== displayChildren.props.location?.pathname) {
      setTransitionStage('page-transition-exit-active');
      setTimeout(() => {
        setDisplayChildren(children);
        setTransitionStage('page-transition-enter');
        
        setTimeout(() => {
          setTransitionStage('page-transition-enter-active');
        }, 10);
      }, 300);
    }
  }, [children, location.pathname, displayChildren]);

  return (
    <div className={`page-transition ${transitionStage}`}>
      {displayChildren}
    </div>
  );
};

export default PageTransition; 