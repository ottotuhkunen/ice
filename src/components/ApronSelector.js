import { useState, useRef } from 'react';
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
    const apronMenuRef = useRef(null);

    const apronOptions = ['AP6', 'AP8'];
    const [pendingApron, setPendingApron] = useState(selectedApron);

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
            <Title style={{ fontSize: '1rem', fontWeight: '600' }}>
                EFHK DEICE{' '}
                <span
                    onClick={() => setMenuOpen((prev) => !prev)}
                    style={{ cursor: 'pointer', textDecoration: 'underline', color: 'orange' }}
                >
          {selectedApron}
        </span>
            </Title>

            {menuOpen && (
                <TreatmentMenu ref={apronMenuRef}>
                    <MenuTitle>ACTIVE REMOTE</MenuTitle>

                    <div className="menu-content-container">
                        {apronOptions.map((apron, index) => (
                            <div key={index}>
                                <div
                                    onClick ={() => handleSelect(apron)}
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
