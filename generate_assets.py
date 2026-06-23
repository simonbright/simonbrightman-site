import os
import matplotlib.pyplot as plt

os.makedirs("images", exist_ok=True)


def save(fig, name):
    plt.tight_layout()
    plt.savefig(f"images/{name}.png", dpi=300, bbox_inches='tight')
    plt.close()


# 1. Runaway Loop (Pipeline)
fig, ax = plt.subplots(figsize=(10, 4))
ax.axis('off')
ax.text(
    0.5, 0.5,
    "RUNAWAY LOOP: \nFriction -> Context Inflation -> Recursive Retry -> Token Burn",
    ha='center', fontsize=14, fontweight='bold',
)
save(fig, "runaway_loop")

# 2. Governance Matrix (Pipeline)
fig, ax = plt.subplots(figsize=(10, 4))
ax.axis('off')
ax.text(
    0.5, 0.5,
    "GOVERNANCE MATRIX: \nStaging (Evaluation) vs. Production (Runtime Controls)",
    ha='center', fontsize=14, fontweight='bold',
)
save(fig, "governance_matrix")

# 3. Silo Breakdown (Silo)
fig, ax = plt.subplots(figsize=(10, 4))
ax.axis('off')
ax.text(
    0.5, 0.5,
    "SILO BREAKDOWN: \nProduct vs. Data vs. Analytics (The Triad of Failure)",
    ha='center', fontsize=14, fontweight='bold',
)
save(fig, "silo_breakdown")

# 4. SaaS Shift (Sprint)
fig, ax = plt.subplots(figsize=(10, 4))
ax.axis('off')
ax.text(
    0.5, 0.5,
    "SAAS SHIFT: \nDeterministic (2010) vs. Agentic (2026) Playbooks",
    ha='center', fontsize=14, fontweight='bold',
)
save(fig, "saas_shift")

# 5. Risk Pipeline (Risk)
fig, ax = plt.subplots(figsize=(10, 4))
ax.axis('off')
ax.text(
    0.5, 0.5,
    "RISK PIPELINE: \nMCP -> Ingestion Filtering -> Interaction Circuits",
    ha='center', fontsize=14, fontweight='bold',
)
save(fig, "risk_pipeline")

# 6. FinOps (Compression)
fig, ax = plt.subplots(figsize=(10, 4))
ax.axis('off')
ax.text(
    0.5, 0.5,
    "TOKEN FINOPS: \nStatic SaaS vs. Unmanaged Autonomy vs. Governed Compression",
    ha='center', fontsize=14, fontweight='bold',
)
save(fig, "finops_engine")

print("Generated 6 images in images/")
