import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# STYLING: Pristine, High-Contrast Light Mode
bg_color = '#FFFFFF'
card_bg = '#F8FAFC'
border_color = '#E2E8F0'
text_main = '#0F172A'
text_muted = '#475569'
accent_blue = '#2563EB'
accent_green = '#16A34A'
accent_red = '#DC2626'
accent_orange = '#EA580C'

BASE_DIR = 'insights_package'

ARTICLES = [
    ("01_ghost_production_pipeline", "ghost_pipeline.md", "ghost_images"),
    ("02_myth_functional_silo", "functional_silo.md", "silo_images"),
    ("03_death_2_week_sprint", "agile_death.md", "sprint_images"),
    ("04_automating_operational_risk", "operational_risk.md", "risk_images"),
    ("05_value_data_compression", "data_compression.md", "compression_images"),
]

ARTICLE_DIRS = [art[0] for art in ARTICLES]
IMG_DIRS = {art[0]: art[2] for art in ARTICLES}


def art_path(article_dir, img_subdir, filename):
    return os.path.join(BASE_DIR, article_dir, img_subdir, filename)


def save_fig(filename):
    plt.tight_layout()
    plt.savefig(filename, dpi=300, facecolor=bg_color, bbox_inches='tight')
    plt.close()


for art_dir, _, img_dir in ARTICLES:
    os.makedirs(os.path.join(BASE_DIR, art_dir, img_dir), exist_ok=True)

print("Creating assets...")

# Graphic 1: Runaway Loop
fig, ax = plt.subplots(figsize=(12, 6.5), facecolor=bg_color)
ax.set_facecolor(bg_color)
ax.set_xlim(0, 12)
ax.set_ylim(0, 6.5)
ax.axis('off')
ax.text(6, 5.9, "THE ANATOMY OF AN AGENTIC RUNAWAY LOOP", color=text_main, fontsize=14, fontweight='bold', ha='center')
ax.text(6, 5.6, "How Unchecked Non-Deterministic Self-Correction Quietly Erases Platform Gross Margins", color=text_muted, fontsize=9.5, ha='center', style='italic')
ax.add_patch(patches.Rectangle((0.8, 3.2), 4.4, 1.6, linewidth=1, edgecolor=border_color, facecolor=card_bg))
ax.text(1.1, 4.4, "1. DOWNSTREAM FRICTION", color=text_main, fontsize=10.5, fontweight='bold')
ax.text(1.1, 3.5, "Agent encounters unhandled edge\ncase, API schema mutation, or\nproduction database rejection.", color=text_muted, fontsize=9)
ax.annotate('', xy=(6.6, 4.0), xytext=(5.4, 4.0), arrowprops=dict(arrowstyle="->", color=accent_red, lw=2, mutation_scale=15))
ax.add_patch(patches.Rectangle((6.8, 3.2), 4.4, 1.6, linewidth=1, edgecolor=border_color, facecolor=card_bg))
ax.text(7.1, 4.4, "2. CONTEXT INFLATION", color=accent_orange, fontsize=10.5, fontweight='bold')
ax.text(7.1, 3.5, "Raw error traces and JSON states\nare injected back into the prompt\nwindow, blowing up token depth.", color=text_muted, fontsize=9)
ax.annotate('', xy=(9.0, 2.0), xytext=(9.0, 3.0), arrowprops=dict(arrowstyle="->", color=accent_red, lw=2, mutation_scale=15))
ax.add_patch(patches.Rectangle((6.8, 0.2), 4.4, 1.6, linewidth=1, edgecolor=border_color, facecolor=card_bg))
ax.text(7.1, 1.4, "3. AUTONOMOUS RETRY", color=accent_red, fontsize=10.5, fontweight='bold')
ax.text(7.1, 0.5, "Stochastic completion loop attempts\nto 'think' its way out, altering prompt\nparameters & triggering re-execution.", color=text_muted, fontsize=9)
ax.annotate('', xy=(5.4, 1.0), xytext=(6.6, 1.0), arrowprops=dict(arrowstyle="->", color=accent_red, lw=2, mutation_scale=15))
ax.add_patch(patches.Rectangle((0.8, 0.2), 4.4, 1.6, linewidth=1, edgecolor=border_color, facecolor=card_bg))
ax.text(1.1, 1.4, "4. RECURSIVE TOKEN BURN", color=accent_red, fontsize=10.5, fontweight='bold')
ax.text(1.1, 0.5, "Machine-speed LLM iterations run\nsilent beneath standard APM alerts,\nmultiplying infrastructure COGS.", color=text_muted, fontsize=9)
ax.annotate('', xy=(3.0, 3.0), xytext=(3.0, 2.0), arrowprops=dict(arrowstyle="->", color=accent_red, lw=2, mutation_scale=15))
ax.text(6, 2.5, "UNMETERED LIABILITY LOOP", color=accent_red, fontsize=9, fontweight='bold', ha='center', bbox=dict(facecolor='#FEF2F2', edgecolor='#FCA5A5', boxstyle='round,pad=0.4'))
ax.text(6, -0.1, "Token FinOps Operational Vulnerability Layer", color='#64748B', fontsize=8, ha='center')
save_fig(art_path(ARTICLE_DIRS[0], IMG_DIRS[ARTICLE_DIRS[0]], "agentic_runaway_loop_light.png"))

# Graphic 2: Governance Matrix
fig, ax = plt.subplots(figsize=(12, 6.5), facecolor=bg_color)
ax.set_facecolor(bg_color)
ax.set_xlim(0, 12)
ax.set_ylim(0, 6.5)
ax.axis('off')
ax.text(6, 5.9, "THE AGENTIC GOVERNANCE MATRIX", color=text_main, fontsize=14, fontweight='bold', ha='center')
ax.text(6, 5.6, "Optimizing Engineering and Operational Controls for Non-Deterministic Software", color=text_muted, fontsize=9.5, ha='center', style='italic')
ax.add_patch(patches.Rectangle((0.5, 0.8), 5.2, 4.4, linewidth=1.5, edgecolor=border_color, facecolor=card_bg))
ax.text(3.1, 4.7, "CONTINUOUS EVALUATION", color=accent_blue, fontsize=11.5, fontweight='bold', ha='center')
ax.text(3.1, 4.4, "(Staging / QA)", color=text_muted, fontsize=9.5, ha='center')
eval_pts = [
    "Automated 'Check-Rides' via REST/Python APIs",
    "Parallel Side-by-Side Model Differing",
    "Playbook Translation to Heuristic Rubrics",
    "Adversarial Counterpart Simulation Staging",
]
for i, pt in enumerate(eval_pts):
    y_pos = 3.6 - (i * 0.7)
    ax.plot(1.0, y_pos + 0.05, marker='o', color=accent_blue, markersize=5)
    ax.text(1.2, y_pos, pt, color=text_main, fontsize=10, va='center')
ax.add_patch(patches.Rectangle((6.3, 0.8), 5.2, 4.4, linewidth=1.5, edgecolor=border_color, facecolor=card_bg))
ax.text(8.9, 4.7, "RUNTIME GOVERNANCE", color=accent_green, fontsize=11.5, fontweight='bold', ha='center')
ax.text(8.9, 4.4, "(Live Production)", color=text_muted, fontsize=9.5, ha='center')
gov_pts = [
    "Session Token Budgeting & Thresholds",
    "Algorithmic Circuit Breakers",
    "Context Window Pruning & Optimization",
    "Hard Tool Execution & Schema Gates",
]
for i, pt in enumerate(gov_pts):
    y_pos = 3.6 - (i * 0.7)
    ax.plot(6.8, y_pos + 0.05, marker='o', color=accent_green, markersize=5)
    ax.text(7.0, y_pos, pt, color=text_main, fontsize=10, va='center')
ax.text(6, 0.2, "Strategy & Architecture Framework", color='#64748B', fontsize=8, ha='center')
save_fig(art_path(ARTICLE_DIRS[0], IMG_DIRS[ARTICLE_DIRS[0]], "agentic_governance_matrix_light.png"))

# Graphic 3: Silo Breakdown
fig, ax = plt.subplots(figsize=(12, 6.5), facecolor=bg_color)
ax.set_facecolor(bg_color)
ax.set_xlim(0, 12)
ax.set_ylim(0, 6.5)
ax.axis('off')
ax.text(6, 5.9, "THE SILOED ARCHITECTURE BREAKDOWN", color=text_main, fontsize=14, fontweight='bold', ha='center')
ax.text(6, 5.6, "The Hidden Repercussions of Segmented Engineering and Product Disconnects", color=text_muted, fontsize=9.5, ha='center', style='italic')
silos = [
    {
        "title": "PRODUCT WITHOUT DATA",
        "sub": "The Feature Factory",
        "color": accent_red,
        "desc": "Ships pristine front-end layouts and speculative user paths\nthat break under real-world enterprise load because the underlying\npipelines cannot handle schema mutation or track lineage.",
    },
    {
        "title": "DATA WITHOUT ANALYTICS",
        "sub": "The COGS Drain",
        "color": accent_blue,
        "desc": "Ingests massive volumes into analytical engines and data lakes,\nbuilding canonical models that simply pile up cloud storage bills\nwithout generating execution precision or system trace metrics.",
    },
    {
        "title": "ANALYTICS WITHOUT PRODUCT",
        "sub": "The Science Project",
        "color": accent_green,
        "desc": "Generates highly sophisticated retrospective diagnostic reports and\nstatistical models that stay isolated on local machines, failing to\ncompress Time-to-Value (TTV) or automate user workflows.",
    },
]
for idx, s in enumerate(silos):
    y_top = 4.6 - (idx * 1.4)
    ax.add_patch(patches.Rectangle((0.5, y_top - 1.1), 11.0, 1.2, linewidth=1, edgecolor=border_color, facecolor=card_bg))
    ax.text(0.8, y_top - 0.3, s["title"], color=s["color"], fontsize=10.5, fontweight='bold')
    ax.text(0.8, y_top - 0.6, s["sub"], color=text_muted, fontsize=9, fontweight='medium')
    ax.text(4.2, y_top - 0.5, s["desc"], color=text_main, fontsize=9.5, va='center')
ax.text(6, 0.2, "Commercial Alignment Matrix | Strategy Framework", color='#64748B', fontsize=8, ha='center')
save_fig(art_path(ARTICLE_DIRS[1], IMG_DIRS[ARTICLE_DIRS[1]], "siloed_architecture_breakdown_light.png"))

# Graphic 4: Shift Table
fig, ax = plt.subplots(figsize=(14, 8), facecolor=bg_color)
ax.set_facecolor(bg_color)
ax.set_xlim(0, 14)
ax.set_ylim(0, 8)
ax.axis('off')
ax.text(7, 7.4, "THE SAAS PRODUCT GOVERNANCE SHIFT", color=text_main, fontsize=14, fontweight='bold', ha='center')
ax.text(7, 7.1, "Optimizing Distributed Teams for Non-Deterministic Architectures", color=text_muted, fontsize=9.5, ha='center', style='italic')
ax.text(4.5, 6.3, "OLD PLAYBOOK (2010)", color=accent_red, fontsize=11.5, fontweight='bold', ha='center')
ax.text(10.5, 6.3, "AGENTIC PLAYBOOK (2026)", color=accent_green, fontsize=11.5, fontweight='bold', ha='center')
rows = [
    {"metric": "Core Logic", "old": "Deterministic Software\nFixed inputs = predictable UI loops", "new": "Non-Deterministic Engines\nProbabilistic LLM workflows & tool-use"},
    {"metric": "Product Specs", "old": "Loose User Stories\n'As a user, I want to intelligently parse...'", "new": "Contract-Driven Specs\nStrict input-output API contracts & schemas"},
    {"metric": "Team Alignment", "old": "Synchronous Standups\nTime-zone drag & calendar alignment friction", "new": "Asynchronous RFC Protocols\nArtifact-driven review in shared code repos"},
    {"metric": "Success Metrics", "old": "Sprint Velocity & Story Points\nTracking shipping volume over actual utility", "new": "Trace Audits & Error Rates\nMeasuring context window efficiency & precision"},
    {"metric": "Monetization", "old": "Legacy Seat Licensing\nDecoupled from actual compute resource draw", "new": "Consumption-Based P&L\nEmbedding infrastructure cost directly into tiers"},
]
for idx, r in enumerate(rows):
    y_center = 5.1 - (idx * 1.1)
    bg_row = card_bg if idx % 2 == 0 else '#F1F5F9'
    ax.add_patch(patches.Rectangle((0.5, y_center - 0.45), 13.0, 0.9, linewidth=0.5, edgecolor=border_color, facecolor=bg_row))
    ax.text(0.8, y_center, r["metric"], color=accent_blue, fontsize=10.5, fontweight='bold', va='center')
    ax.text(4.5, y_center, r["old"], color=text_main, fontsize=9.5, ha='center', va='center')
    ax.text(10.5, y_center, r["new"], color=text_main, fontsize=9.5, ha='center', va='center')
ax.text(7, 0.2, "Strategy & Architecture Framework", color='#64748B', fontsize=8, ha='center')
save_fig(art_path(ARTICLE_DIRS[2], IMG_DIRS[ARTICLE_DIRS[2]], "saas_product_governance_shift_light.png"))

# Graphic 5: Data Layer
fig, ax = plt.subplots(figsize=(12, 5), facecolor=bg_color)
ax.set_facecolor(bg_color)
ax.set_xlim(0, 12)
ax.set_ylim(0, 5)
ax.axis('off')
ax.text(6, 4.4, "AGENTIC DATA GOVERNANCE LAYER", color=text_main, fontsize=13.5, fontweight='bold', ha='center')
ax.text(6, 4.1, "Deterministic Data Guardrails for Non-Deterministic Execution Operators", color=text_muted, fontsize=9, ha='center', style='italic')
ax.add_patch(patches.Rectangle((0.5, 1.5), 3.2, 1.8, linewidth=1, edgecolor=border_color, facecolor=card_bg))
ax.text(2.1, 2.7, "MODEL CONTEXT\nPROTOCOLS (MCP)", color=accent_blue, fontsize=10.5, fontweight='bold', ha='center')
ax.text(2.1, 1.9, "Restricts data discovery\nand zero-trust access", color=text_muted, fontsize=8.5, ha='center')
ax.annotate('', xy=(4.4, 2.4), xytext=(3.8, 2.4), arrowprops=dict(arrowstyle="->", color=text_muted, lw=2))
ax.add_patch(patches.Rectangle((4.4, 1.5), 3.2, 1.8, linewidth=1, edgecolor=border_color, facecolor=card_bg))
ax.text(6.0, 2.7, "INGESTION-FILTER\nLAYERS", color=accent_green, fontsize=10.5, fontweight='bold', ha='center')
ax.text(6.0, 1.9, "Prunes active context window\n+18-24% execution accuracy", color=text_muted, fontsize=8.5, ha='center')
ax.annotate('', xy=(8.3, 2.4), xytext=(7.7, 2.4), arrowprops=dict(arrowstyle="->", color=text_muted, lw=2))
ax.add_patch(patches.Rectangle((8.3, 1.5), 3.2, 1.8, linewidth=1, edgecolor=border_color, facecolor=card_bg))
ax.text(9.9, 2.7, "RUNTIME CIRCUIT\nBREAKERS", color=accent_red, fontsize=10.5, fontweight='bold', ha='center')
ax.text(9.9, 1.9, "Enforces turn budgets and\nfallback to human routing", color=text_muted, fontsize=8.5, ha='center')
ax.text(6, 0.3, "Infrastructure Security Architecture Framework", color='#64748B', fontsize=8, ha='center')
save_fig(art_path(ARTICLE_DIRS[3], IMG_DIRS[ARTICLE_DIRS[3]], "agentic_data_governance_layer_light.png"))

# Graphic 6: FinOps Monetization
fig, ax = plt.subplots(figsize=(12, 5.5), facecolor=bg_color)
ax.set_facecolor(bg_color)
ax.set_xlim(0, 12)
ax.set_ylim(0, 5.5)
ax.axis('off')
ax.text(6, 4.9, "TOKEN FINOPS MONETIZATION ENGINE", color=text_main, fontsize=13.5, fontweight='bold', ha='center')
ax.text(6, 4.6, "Compressing Non-Deterministic Variance into Resilient Enterprise Profit Margins", color=text_muted, fontsize=9, ha='center', style='italic')
models = [
    {"label": "TRADITIONAL SAAS", "box": "Static Seat Licenses", "pnl": "Fixed Top-Line Revenue", "color": text_muted},
    {"label": "UNMANAGED AGENTS", "box": "Volatile Token Spend Loop", "pnl": "Unpredictable COGS Chaos", "color": accent_red},
    {"label": "GOVERNED PLATFORM", "box": "Predictable Token Budgets", "pnl": "High-Margin Consumption ROI", "color": accent_green},
]
for idx, m in enumerate(models):
    x_offset = 0.5 + (idx * 3.8)
    ax.add_patch(patches.Rectangle((x_offset, 1.2), 3.4, 2.6, linewidth=1.5, edgecolor=m["color"], facecolor=card_bg))
    ax.text(x_offset + 1.7, 3.4, m["label"], color=m["color"], fontsize=10.5, fontweight='bold', ha='center')
    ax.text(x_offset + 1.7, 2.6, m["box"], color=text_main, fontsize=9.5, ha='center')
    ax.text(x_offset + 1.7, 1.8, m["pnl"], color=text_muted, fontsize=9, ha='center', style='italic')
ax.text(6, 0.2, "Token FinOps Framework | Value Realization Engine", color='#64748B', fontsize=8, ha='center')
save_fig(art_path(ARTICLE_DIRS[4], IMG_DIRS[ARTICLE_DIRS[4]], "token_finops_monetization_light.png"))

print("Folder structure and assets generated.")
