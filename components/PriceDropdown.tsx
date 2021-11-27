import React, { useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from '@/styles/modules/PricingDropdown.module.scss'
import Image from 'next/image'
import Dollar from '@/images/Dollar.svg'
import Invoice from '@/images/Invoice.svg'

export const PriceDropdown = ({ setSelectedPlan }: any) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="pricingDropdown">
            <p onClick={(e) => setOpen(!open)} >Select plan {'>'}</p>
            {open && <Dropdown setSelectedPlan={setSelectedPlan} />}
        </div>
    );
}

const Dropdown = ({ setSelectedPlan }: any) => {

    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);

    const calcHeight = (el: any) => {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    const update = (e: any) => {
        setSelectedPlan(e.target.text)
    }

    return (
        <div className="dropdown" style={{ height: menuHeight || "1" }} ref={dropdownRef}>
            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <a className="menu-item" onClick={() => "Subscription based payment" && setActiveMenu("Subscription based payment")}>
                        <Image src={Dollar} alt="dollar" /> Subscription based
                    </a>

                    <a className="menu-item" onClick={() => "One time payment" && setActiveMenu("One time payment")}>
                        <Image src={Invoice} alt="invoice" /> One time payment
                    </a>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'Subscription based payment'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <a className="menu-item" onClick={() => "main" && setActiveMenu("main")}>
                        <Image src={Dollar} alt="dollar" /> <h2> Subscription based</h2>
                    </a>
                    <a className="menu-item" onClick={(e) => update(e)}>Basic - $1/year</a>
                    <a className="menu-item" onClick={(e) => update(e)}>Pro - $5/year</a>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'One time payment'}
                timeout={500}
                classNames="menu-secondary"
                unmountOnExit
                onEnter={calcHeight}>
                <div className="menu">
                    <a className="menu-item" onClick={(e) => "main" && setActiveMenu("main")}>
                        <Image src={Invoice} alt="invoice" /> <h2>One time payment</h2>
                    </a>
                    <a className="menu-item" onClick={(e) => update(e)}>Basic - $3</a>
                    <a className="menu-item" onClick={(e) => update(e)}>Pro - $15</a>
                </div>
            </CSSTransition>

        </div>
    )
}