
// アプリケーション状態管理
const state = {
    currentUser: null, // 'employee' or 'admin' or null
    currentScreen: 'login',
    screens: {}
};

// 画面定義
const SCREENS = {
    login: 'screens/login.html',
    employee_home: 'screens/employee_home.html',
    admin_home: 'screens/admin_home.html',
    time_record_input: 'screens/time_record_input.html',
    time_record_history: 'screens/time_record_history.html',
    employee_attendance_view: 'screens/employee_attendance_view.html',
    paid_leave_confirm: 'screens/paid_leave_confirm.html',
    paid_leave_apply: 'screens/paid_leave_apply.html',
    employee_info_change: 'screens/employee_info_change.html',
    login_info_change: 'screens/login_info_change.html',
    paid_leave_manage: 'screens/paid_leave_manage.html',
    employee_info_change_manage: 'screens/employee_info_change_manage.html',
    monthly_closing: 'screens/monthly_closing.html',
    monthly_closing_history: 'screens/monthly_closing_history.html',
    monthly_closing_detail: 'screens/monthly_closing_detail.html',
    employee_time_record_manage: 'screens/employee_time_record_manage.html',
    admin_attendance_view: 'screens/admin_attendance_view.html',
    employee_info_manage: 'screens/employee_info_manage.html',
    admin_info_manage: 'screens/admin_info_manage.html',
    deduction_addition_edit: 'screens/deduction_addition_edit.html',
    company_info_edit: 'screens/company_info_edit.html'
};

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupEventListeners();
    navigateTo('login');
}

function setupEventListeners() {
    // ロゴクリック
    document.getElementById('header-logo').addEventListener('click', () => {
        if (state.currentUser === 'employee') {
            navigateTo('employee_home');
        } else if (state.currentUser === 'admin') {
            navigateTo('admin_home');
        } else {
            navigateTo('login');
        }
    });

    // ハンバーガーメニュー
    document.getElementById('app-menu-btn').addEventListener('click', openMenu);
    document.querySelector('.menu-close').addEventListener('click', closeMenu);
    document.getElementById('app-menu-overlay').addEventListener('click', closeMenu);
}

// 画面遷移
async function navigateTo(screenId) {
    state.currentScreen = screenId;
    
    // ヘッダー表示制御
    const header = document.getElementById('app-header');
    if (screenId === 'login') {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }

    // 画面ロード
    const main = document.getElementById('app-main');
    main.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading...</div>';

    try {
        // キャッシュまたはフェッチ
        let content = state.screens[screenId];
        if (!content) {
            const response = await fetch(SCREENS[screenId]);
            if (!response.ok) throw new Error(`Screen not found: ${screenId}`);
            content = await response.text();
            state.screens[screenId] = content;
        }
        main.innerHTML = content;
        
        // 画面ごとの初期化処理（簡易的なモック動作）
        attachScreenEvents(screenId);
        
        // メニュー再生成
        updateMenu();

    } catch (error) {
        console.error(error);
        main.innerHTML = `<div class="error-message">Error loading screen: ${screenId}</div>`;
    }
    
    closeMenu();
}

// 画面イベントのアタッチ（モック用）
function attachScreenEvents(screenId) {
    // 共通: 戻るボタンなどがあれば
    
    // ログイン画面
    if (screenId === 'login') {
        const btn = document.querySelector('#login-btn');
        if (btn) {
            btn.addEventListener('click', () => {
                const id = document.querySelector('#member-id').value;
                if (id.startsWith('admin')) {
                    state.currentUser = 'admin';
                    navigateTo('admin_home');
                } else {
                    state.currentUser = 'employee';
                    navigateTo('employee_home');
                }
            });
        }
    }
    
    // 汎用的な遷移ボタンのハンドリング
    document.querySelectorAll('[data-goto]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(el.dataset.goto);
        });
    });

    // 確認ダイアログ等のモック
    document.querySelectorAll('[data-confirm]').forEach(el => {
        el.addEventListener('click', (e) => {
            if(confirm(el.dataset.confirm || '実行しますか？')) {
                const next = el.dataset.next;
                if (next) navigateTo(next);
            }
        });
    });
}

// メニュー操作
function openMenu() {
    updateMenu();
    document.getElementById('app-menu-overlay').classList.remove('hidden');
    document.getElementById('app-menu-content').classList.add('open');
}

function closeMenu() {
    document.getElementById('app-menu-overlay').classList.add('hidden');
    document.getElementById('app-menu-content').classList.remove('open');
}

function updateMenu() {
    const list = document.getElementById('menu-list');
    list.innerHTML = '';
    
    let items = [];
    
    if (state.currentUser === 'employee') {
        items = [
            { label: 'ホームへ', action: 'employee_home' },
            { label: '打刻する', action: 'time_record_input' },
            { label: '打刻履歴', action: 'time_record_history' },
            { label: '勤怠状態閲覧', action: 'employee_attendance_view' },
            { label: '有給申請＆残有給数確認', action: 'paid_leave_confirm' },
            { label: '従業員情報変更申請', action: 'employee_info_change' },
            { label: 'ログイン情報変更', action: 'login_info_change' },
            { label: 'ログアウト', action: 'logout' }
        ];
    } else if (state.currentUser === 'admin') {
        items = [
            { label: 'ホームへ', action: 'admin_home' },
            { label: '有給申請管理', action: 'paid_leave_manage' },
            { label: '従業員情報変更申請管理', action: 'employee_info_change_manage' },
            { label: '月次締め作業', action: 'monthly_closing' },
            { label: '月次締め履歴', action: 'monthly_closing_history' },
            { label: '従業員打刻履歴', action: 'employee_time_record_manage' },
            { label: '勤怠状態閲覧', action: 'admin_attendance_view' },
            { label: '従業員情報＆勤怠集計情報', action: 'employee_info_manage' },
            { label: '管理者情報', action: 'admin_info_manage' },
            { label: '控除&加算項目編集', action: 'deduction_addition_edit' },
            { label: '会社情報編集', action: 'company_info_edit' },
            { label: 'ログイン情報変更', action: 'login_info_change' },
            { label: 'ログアウト', action: 'logout' }
        ];
    } else {
        // 未ログイン時はメニューなし
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.textContent = item.label;
        div.addEventListener('click', () => {
            if (item.action === 'logout') {
                state.currentUser = null;
                navigateTo('login');
            } else {
                navigateTo(item.action);
            }
        });
        list.appendChild(div);
    });
}
