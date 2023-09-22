import React from 'react';
import { Canvas } from '@react-three/fiber';
import CarViewer from './carviewer';
import Header from './Header';
import Footer from './Footer';
import styles from './CarViewer.module.css';

function App() {
  return (
    <div className={styles.carViewerContainer}>
      <Header/>
      <main className={styles.main}>
        <Canvas>
          <CarViewer/>
        </Canvas>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
