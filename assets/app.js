const featureCatalog = [
  {
    id: "core",
    label: "核心工具",
    description: "",
    features: [
      {
        name: "JWT Token",
        description: "JWT Token 解析器",
        tags: ["JWT Token"],
        url: "https://www.jwt.io/",
      },
      {
        name: "Guid",
        description: "Guid 產生器",
        tags: ["guid"],
        url: "https://guidgenerator.com/",
      },
    ],
  },
  {
    id: "dev",
    label: "開發能力",
    description: "針對工程實作的輔助模組，包含品質與交付效率。",
    features: [
      {
        name: "自動測試面板",
        status: "ready",
        description: "彙整測試結果與失敗重點，快速定位失敗來源。",
        tags: ["測試", "回歸檢查", "品質監控"],
        url: "#",
      },
      {
        name: "部署檢查清單",
        status: "beta",
        description: "部署前自動核對必要項目，避免遺漏設定與依賴。",
        tags: ["部署", "風險控管", "準備度"],
        url: "#",
      },
      {
        name: "API 探索器",
        status: "roadmap",
        description: "可視化瀏覽 API 能力與範例請求，縮短整合時間。",
        tags: ["API", "文件導覽", "整合效率"],
        url: "#",
      },
    ],
  },
  {
    id: "insight",
    label: "洞察分析",
    description: "從資料與紀錄提取可行洞察，支援更快決策。",
    features: [
      {
        name: "趨勢看板",
        status: "ready",
        description: "以卡片式摘要呈現關鍵趨勢，快速掌握變化。",
        tags: ["趨勢", "視覺摘要", "指標"],
        url: "#",
      },
      {
        name: "異常提醒",
        status: "beta",
        description: "針對關鍵指標異常波動發出提醒，提早介入處理。",
        tags: ["告警", "異常偵測", "即時反應"],
        url: "#",
      },
      {
        name: "報告生成器",
        status: "roadmap",
        description: "依模板快速輸出週報與月報，統一對外溝通格式。",
        tags: ["自動報告", "模板", "溝通效率"],
        url: "#",
      },
    ],
  },
  {
    id: "notes",
    label: "筆記",
    description: "收錄 AI 與部署實務筆記，方便快速查閱與分享。",
    features: [
      {
        name: "AI 筆記",
        description: "AI 相關筆記，整理模型、工具與應用實作重點。",
        tags: ["LLM"],
        url: "https://jackwio.github.io/ai-note/",
      },
      {
        name: "Deploy 筆記",
        description: "聚焦 Zeabur、Docker、K8s 實戰紀錄。",
        tags: ["Zeabur", "Docker", "K8s"],
        url: "https://jackwio.github.io/deploy-note/",
      },
    ],
  },
];

const statusTextMap = {
  ready: "READY",
  beta: "BETA",
  roadmap: "ROADMAP",
};

let activeTab = featureCatalog.find((item) => item.id === "notes")?.id ?? featureCatalog[0].id;

const tabListElement = document.querySelector("#feature-tabs");
const cardsGridElement = document.querySelector("#cards-grid");
const panelElement = document.querySelector("#tab-panel");
const panelDescriptionElement = document.querySelector("#panel-description");
const panelCountElement = document.querySelector("#panel-count");

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderTabs() {
  tabListElement.innerHTML = featureCatalog
    .map((category) => {
      const isActive = category.id === activeTab;
      return `
        <button
          id="tab-${category.id}"
          class="tab-button"
          role="tab"
          type="button"
          aria-selected="${isActive ? "true" : "false"}"
          tabindex="${isActive ? "0" : "-1"}"
          aria-controls="tab-panel"
          data-tab-id="${category.id}"
        >
          ${escapeHtml(category.label)}
        </button>
      `;
    })
    .join("");

  tabListElement.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tabId));
    button.addEventListener("keydown", (event) => {
      const currentIndex = featureCatalog.findIndex(
        (item) => item.id === button.dataset.tabId
      );
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;
      if (event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % featureCatalog.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + featureCatalog.length) % featureCatalog.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = featureCatalog.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      const nextTabId = featureCatalog[nextIndex].id;
      switchTab(nextTabId);
      tabListElement
        .querySelector(`button[data-tab-id="${nextTabId}"]`)
        ?.focus();
    });
  });
}

function renderCards() {
  const selectedCategory = featureCatalog.find((item) => item.id === activeTab);
  if (!selectedCategory) return;

  panelElement.setAttribute("aria-labelledby", `tab-${selectedCategory.id}`);
  panelDescriptionElement.textContent = selectedCategory.description;
  panelCountElement.textContent = `${selectedCategory.features.length} 個功能`;

  cardsGridElement.innerHTML = selectedCategory.features
    .map((feature, index) => {
      const statusText = statusTextMap[feature.status];
      const statusClass = statusText ? `status-${feature.status}` : "";
      const statusMarkup = statusText
        ? `<span class="card-status ${statusClass}">${statusText}</span>`
        : "";
      const tagsMarkup = feature.tags
        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
        .join("");

      return `
        <article class="feature-card" style="--delay:${index * 90}ms">
          <div class="card-head">
            <h3 class="card-title">
              <a href="${escapeHtml(feature.url)}" class="card-title-link" aria-label="${escapeHtml(feature.name)} 詳細資訊">${escapeHtml(feature.name)}</a>
            </h3>
            ${statusMarkup}
          </div>
          <p class="card-desc">${escapeHtml(feature.description)}</p>
          <div class="tag-row">${tagsMarkup}</div>
        </article>
      `;
    })
    .join("");
}

function switchTab(nextTab) {
  if (!featureCatalog.some((item) => item.id === nextTab)) return;
  activeTab = nextTab;
  renderTabs();
  renderCards();
}

renderTabs();
renderCards();
