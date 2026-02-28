import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'

UiPage({
    $id: Now.ID['commission_dashboard_page'],
    endpoint: 'x_823178_commissio_dashboard.do',
    description: 'Commission Management Dashboard - Main overview and navigation',
    category: 'general',
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Commission Management Dashboard</title>
            <style>
                :root {
                    --primary-color: #0066cc;
                    --success-color: #28a745;
                    --warning-color: #ffc107;
                    --danger-color: #dc3545;
                    --info-color: #17a2b8;
                    --light-bg: #f8f9fa;
                    --shadow: 0 2px 4px rgba(0,0,0,0.1);
                    --border-radius: 8px;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: var(--light-bg);
                    line-height: 1.6;
                    color: #333;
                }
                
                .dashboard-container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .dashboard-header {
                    background: white;
                    padding: 30px;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    margin-bottom: 30px;
                    text-align: center;
                }
                
                .dashboard-title {
                    color: var(--primary-color);
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .dashboard-subtitle {
                    color: #666;
                    font-size: 1.2rem;
                }
                
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 25px;
                    margin-bottom: 40px;
                }
                
                .stat-card {
                    background: white;
                    padding: 30px;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    text-align: center;
                    border-left: 5px solid var(--primary-color);
                    transition: transform 0.2s ease;
                }
                
                .stat-card:hover {
                    transform: translateY(-2px);
                }
                
                .stat-card.success {
                    border-left-color: var(--success-color);
                }
                
                .stat-card.warning {
                    border-left-color: var(--warning-color);
                }
                
                .stat-card.info {
                    border-left-color: var(--info-color);
                }
                
                .stat-number {
                    font-size: 3rem;
                    font-weight: bold;
                    color: var(--primary-color);
                    margin-bottom: 10px;
                }
                
                .stat-label {
                    font-size: 1.1rem;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 25px;
                    margin-bottom: 40px;
                }
                
                .action-section {
                    background: white;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                    overflow: hidden;
                }
                
                .action-header {
                    background: var(--primary-color);
                    color: white;
                    padding: 20px;
                    font-size: 1.2rem;
                    font-weight: bold;
                }
                
                .action-content {
                    padding: 20px;
                }
                
                .action-button {
                    display: block;
                    width: 100%;
                    padding: 15px;
                    margin-bottom: 10px;
                    background: var(--light-bg);
                    color: #333;
                    text-decoration: none;
                    border-radius: 4px;
                    text-align: center;
                    font-weight: bold;
                    transition: all 0.2s ease;
                    border: 2px solid transparent;
                }
                
                .action-button:hover {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                    text-decoration: none;
                }
                
                .action-button.success {
                    background: var(--success-color);
                    color: white;
                }
                
                .action-button.warning {
                    background: var(--warning-color);
                    color: white;
                }
                
                .action-button.danger {
                    background: var(--danger-color);
                    color: white;
                }
                
                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 25px;
                }
                
                .feature-card {
                    background: white;
                    padding: 25px;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow);
                }
                
                .feature-title {
                    color: var(--primary-color);
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin-bottom: 15px;
                }
                
                .feature-description {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }
                
                .feature-list {
                    list-style: none;
                    padding-left: 0;
                }
                
                .feature-list li {
                    padding: 5px 0;
                    color: #555;
                }
                
                .feature-list li:before {
                    content: "✓ ";
                    color: var(--success-color);
                    font-weight: bold;
                    margin-right: 10px;
                }
                
                @media (max-width: 768px) {
                    .dashboard-title {
                        font-size: 2rem;
                    }
                    
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .actions-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .feature-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        </head>
        <body>
            <div class="dashboard-container">
                <!-- Header -->
                <div class="dashboard-header">
                    <h1 class="dashboard-title">Commission Management System</h1>
                    <p class="dashboard-subtitle">Comprehensive commission tracking and management platform</p>
                </div>
                
                <!-- Statistics Overview -->
                <div class="stats-grid">
                    <div class="stat-card success">
                        <div class="stat-number">$1.2M</div>
                        <div class="stat-label">Total Commissions</div>
                    </div>
                    <div class="stat-card info">
                        <div class="stat-number">247</div>
                        <div class="stat-label">Active Deals</div>
                    </div>
                    <div class="stat-card warning">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Pending Reviews</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">98%</div>
                        <div class="stat-label">System Health</div>
                    </div>
                </div>
                
                <!-- Quick Actions -->
                <div class="actions-grid">
                    <div class="action-section">
                        <div class="action-header">📊 Data Management</div>
                        <div class="action-content">
                            <a href="/x_823178_commissio_deals_list.do" class="action-button">
                                View All Deals
                            </a>
                            <a href="/x_823178_commissio_invoices_list.do" class="action-button">
                                View Invoices
                            </a>
                            <a href="/x_823178_commissio_payments_list.do" class="action-button">
                                View Payments
                            </a>
                        </div>
                    </div>
                    
                    <div class="action-section">
                        <div class="action-header">💰 Commission Management</div>
                        <div class="action-content">
                            <a href="/x_823178_commissio_commission_calculations_list.do" class="action-button success">
                                Commission Calculations
                            </a>
                            <a href="/x_823178_commissio_commission_plans_list.do" class="action-button">
                                Commission Plans
                            </a>
                            <a href="/x_823178_commissio_commission_statements_list.do" class="action-button">
                                Monthly Statements
                            </a>
                        </div>
                    </div>
                    
                    <div class="action-section">
                        <div class="action-header">⚙️ Administration</div>
                        <div class="action-content">
                            <a href="/x_823178_commissio_exception_approvals_list.do" class="action-button warning">
                                Exception Approvals
                            </a>
                            <a href="/x_823178_commissio_system_alerts_list.do" class="action-button danger">
                                System Alerts
                            </a>
                            <a href="/x_823178_commissio_reconciliation_log_list.do" class="action-button">
                                Reconciliation Log
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- Feature Overview -->
                <div class="feature-grid">
                    <div class="feature-card">
                        <h3 class="feature-title">🔄 Automated Sync</h3>
                        <p class="feature-description">
                            Seamlessly integrates with Zoho Bigin and Zoho Books for real-time data synchronization.
                        </p>
                        <ul class="feature-list">
                            <li>Real-time deal sync from Bigin</li>
                            <li>Invoice sync from Books</li>
                            <li>Payment tracking and reconciliation</li>
                            <li>Automated commission calculations</li>
                        </ul>
                    </div>
                    
                    <div class="feature-card">
                        <h3 class="feature-title">🛡️ Security & Compliance</h3>
                        <p class="feature-description">
                            Enterprise-grade security with role-based access and comprehensive audit trails.
                        </p>
                        <ul class="feature-list">
                            <li>Role-based access control</li>
                            <li>Complete audit trail</li>
                            <li>Data integrity safeguards</li>
                            <li>Financial reconciliation</li>
                        </ul>
                    </div>
                    
                    <div class="feature-card">
                        <h3 class="feature-title">📈 Advanced Analytics</h3>
                        <p class="feature-description">
                            Comprehensive reporting and analytics for commission tracking and performance monitoring.
                        </p>
                        <ul class="feature-list">
                            <li>Monthly commission statements</li>
                            <li>Performance tracking</li>
                            <li>Exception management</li>
                            <li>System monitoring alerts</li>
                        </ul>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `,
    clientScript: `
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Commission Management Dashboard loaded successfully');
        });
    `
})