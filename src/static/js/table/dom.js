const elements = {
    table_id: 'table-id-display',

    hero: 'hero',
    villain: 'villain',
    hero_stack: 'hero-stack',
    villain_stack: 'villain-stack',

    hero_name: 'hero-name',
    villain_name: 'villain-name',
    start_table_btn: 'start-table',

    actions: 'actions',
    community_cards: 'community-cards',
    pot_amount: 'pot-amount',

    bet_btn: 'bet-btn',
    check_btn: 'check-btn',
    fold_btn: 'fold-btn',

    call_btn: 'call-btn',
    raise_btn: 'raise-btn',

    bet_amount: 'bet-amount',

    hero_bet: 'hero-bet',
    villain_bet: 'villain-bet',

    username_modal: 'username-modal',
    username_form: 'username-form',
    username_input: 'username',
    username_submit: 'username-submit',
}

export function get_elements(doc) {
    const result = {};
    for (const [key, id] of Object.entries(elements)) {
        result[key] = doc.getElementById(id);
    }
    return result;
};
