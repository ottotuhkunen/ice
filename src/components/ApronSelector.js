import { useState, useEffect, useRef } from 'react';
import {
    TreatmentMenu,
    MenuTitle,
    ConfirmButton,
    CloseButton,
    Title,
} from '../styles/ATCViewStyles';

function EFHKDeiceMenu({
                           selectedApron,
                           saveSelectedApron,
                           closeMenus,
                           isSending,
                           user,
                       }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const apronMenuRef = useRef(null);

    const apronOptions = ['AP6', 'AP8'];
    const [pendingApron, setPendingApron] = useState(selectedApron);

    // Update UTC time every second
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getUTCHours()).padStart(2, '0');
            const minutes = String(now.getUTCMinutes()).padStart(2, '0');
            const seconds = String(now.getUTCSeconds()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}:${seconds}`);
        };

        updateTime(); // set immediately on mount
        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSelect = (value) => {
        setPendingApron(value); // only mark selection locally
    };

    const handleApply = () => {
        saveSelectedApron(pendingApron); // apply only when clicking APPLY
        closeMenus();
        setMenuOpen(false);
    };

    return (
        <>
            <Title className="!text-xs font-bold !font-sans pl-1 flex items-center">
                <span className="inline-block !w-28 text-left">UTC {currentTime}</span>
                <span>REMOTE</span>
                <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="text-blue-500 underline ml-1"
                >
                    {selectedApron}
                </button>
                <span className="ml-8">Roles</span>
                <span className="ml-1.5">DEICE</span>

            </Title>

            {menuOpen && (
                <TreatmentMenu ref={apronMenuRef}>
                    <MenuTitle>ACTIVE REMOTE</MenuTitle>

                    <div className="menu-content-container">
                        {apronOptions.map((apron, index) => (
                            <div key={index}>
                                <div
                                    onClick={() => handleSelect(apron)}
                                    className="atc-treatment-menu-content"
                                    style={{
                                        backgroundColor:
                                            pendingApron === apron ? 'darkblue' : '',
                                        color: pendingApron === apron ? 'white' : '',
                                    }}
                                >
                                    {apron}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p
                        style={{
                            margin: '8px',
                            textAlign: 'center',
                            color: '#696969',
                            fontWeight: 'bold',
                            fontSize: '9pt',
                        }}
                    >
                        Do not change unintentionally. The selection is visible to all users.
                    </p>

                    <ConfirmButton onClick={handleApply} disabled={isSending}>
                        {isSending ? 'Saving...' : 'APPLY'}
                    </ConfirmButton>

                    <CloseButton
                        onClick={() => {
                            closeMenus();
                            setMenuOpen(false);
                            setPendingApron(selectedApron); // reset unsaved selection
                        }}
                    >
                        CANCEL
                    </CloseButton>
                </TreatmentMenu>
            )}
        </>
    );
}

export default EFHKDeiceMenu;