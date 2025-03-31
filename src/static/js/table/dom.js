export function get_elements(doc) {
    return {
        table_id: doc.getElementById('table-id-display'),
        hero_name: doc.getElementById('player-name-display'),

        hero: doc.getElementById('hero'),
        villain: doc.getElementById('villain'),

        hero_stack: doc.getElementById('hero-stack'),
        villain_stack: doc.getElementById('villain-stack'),

        hero_name: doc.getElementById('hero-name'),
        villain_name: doc.getElementById('villain-name'),

        start_table_btn: doc.getElementById('start-table'),

        actions: doc.getElementById('actions'),
        community_cards: doc.getElementById('community-cards'),

        pot_amount: doc.getElementById('pot-amount'),

        bet_btn: doc.getElementById('bet-btn'),
        bet_amount: doc.getElementById('bet-amount'),

        hero_bet: doc.getElementById('hero-bet'),
        villain_bet: doc.getElementById('villain-bet'),

        username_modal: doc.getElementById('username-modal'),
        username_form: doc.getElementById('username-form'),
        username_input: doc.getElementById('username'),
    }
};
