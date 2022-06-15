import React, { useEffect, useRef } from "react";
import { motion, useCycle } from "framer-motion";
import useDimensions  from "./use-dimensions";
import Navigation  from "./Navigation";
import MenuToggle  from "./MenuToggle";
import styles from "./styles.module.scss";
import Modal from '../../Views/ModalCreator';
import { useStoreon } from "storeon/react";

const sidebar = {
    open: (height = 1000) => ({
        clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
        backgroundColor: 'rgba(0,0,0,.4)',
        // opacity: 0.5,
        transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2
        }
    }),
    closed: {
        clipPath: "circle(23px at 40px 40px)",
        backgroundColor: 'rgb(255, 209, 209)',
        transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40
        }
    }
};

const BurgerMenu = ({ itemIds, site_configuration }) => {
    const {toggleBurgerMenu}=useStoreon('toggleBurgerMenu');
    const [isOpen, toggleOpen] = useCycle(false, true);
    const containerRef = useRef(null);
    const { height } = useDimensions(containerRef);
    useEffect(() => {
      const body = document.querySelector('body');
      body.style.overflow = isOpen ? 'hidden' : 'auto';
    }, [isOpen])

    useEffect(()=>{
        toggleBurgerMenu === 2 || toggleBurgerMenu === 1 ? toggleOpen() : null
    },[toggleBurgerMenu])

    return (
        <motion.nav
        
            className={styles["burger-nav"]}
            initial={false}
            animate={isOpen ? "open" : "closed"}
            custom={height}
            ref={containerRef}
        >
            <Modal.StorControllerModal />
            <motion.div className={styles["burger-background"]} variants={sidebar}>
                <Navigation itemIds={itemIds} site_configuration ={site_configuration } isOpen={isOpen}/>
                <MenuToggle toggle={() => toggleOpen()} />
            </motion.div>
        </motion.nav>
    )
}

export default BurgerMenu;
