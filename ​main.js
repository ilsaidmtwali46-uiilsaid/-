/* ==========================================
   1. محرك النطق الصوتي (Speech Synthesis)
   ========================================== */
function speakText(text) {
    if ('speechSynthesis' in window) {
        // إلغاء أي صوت سابق يعمل حالياً
        window.speechSynthesis.cancel();
        
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA'; // اللغة العربية
        utterance.rate = 0.85;    // سرعة القراءة
        utterance.pitch = 1.0;    // درجة الصوت
        
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn("ميزة النطق الصوتي غير مدعومة في هذا المتصفح.");
    }
}

/* ==========================================
   2. التحكم في تبويب أزرار الإعراب (Grammar Tabs)
   ========================================== */
function openGrammarTab(tabId, btn) {
    // إخفاء جميع محتويات الأقسام
    var contents = document.getElementsByClassName("grammar-tab-content");
    for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
    }

    // إلغاء تفعيل جميع الأزرار
    var keys = document.querySelectorAll(".sub-keys .key-btn");
    for (var j = 0; j < keys.length; j++) {
        keys[j].classList.remove("active");
    }

    // إظهار القسم المختار وتحديد الزر النشط
    var targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.display = "block";
    }
    if (btn) {
        btn.classList.add("active");
    }
}

/* ==========================================
   3. منطق لعبة "الحرف الناقص"
   ========================================== */
var gameQuestions = [
    { word: "أَ_دٌ", missing: "سَـ", options: ["سَـ", "بَـ", "تَـ"], full: "أَسَدٌ" },
    { word: "بَ_رَةٌ", missing: "قَـ", options: ["قَـ", "فَـ", "كَـ"], full: "بَقَرَةٌ" },
    { word: "كِتَا_", missing: "بٌ", options: ["ـبٌ", "ـتٌ", "ـلٌ"], full: "كِتَابٌ" },
    { word: "شَ_رَةٌ", missing: "جَـ", options: ["ـجَـ", "ـحَـ", "ـخَـ"], full: "شَجَرَةٌ" },
    { word: "قَلَ_", missing: "مٌ", options: ["ـمٌ", "ـنٌ", "ـلٌ"], full: "قَلَمٌ" },
    { word: "تُفَّا_", missing: "حٌ", options: ["ـحٌ", "ـجٌ", "ـخٌ"], full: "تُفَّاحٌ" },
    { word: "قِطَا_", missing: "رٌ", options: ["ـرٌ", "ـزٌ", "ـدٌ"], full: "قِطَارٌ" },
    { word: "عُصْفُو_", missing: "رٌ", options: ["ـرٌ", "ـزٌ", "ـسٌ"], full: "عُصْفُورٌ" }
];

var gIndex = 0;

// تحميل السؤال الحالي
function loadGameQ() {
    var qNumElem = document.getElementById("qNum");
    var qTotalElem = document.getElementById("qTotal");
    var gWordElem = document.getElementById("gWord");
    var gMsgElem = document.getElementById("gMsg");
    var gNextBtn = document.getElementById("gNextBtn");
    var container = document.getElementById("gOpts");

    if (!gWordElem || !container) return; // التأكد من وجود أجزاء اللعبة في الصفحة

    var q = gameQuestions[gIndex];
    if (qNumElem) qNumElem.innerText = gIndex + 1;
    if (qTotalElem) qTotalElem.innerText = gameQuestions.length;
    
    gWordElem.innerText = q.word;
    if (gMsgElem) gMsgElem.innerText = "";
    if (gNextBtn) gNextBtn.style.display = "none";

    container.innerHTML = "";
    q.options.forEach(function(opt) {
        var btn = document.createElement("button");
        btn.className = "opt-btn";
        btn.innerText = opt;
        btn.onclick = function() { checkGameAns(opt, q.missing, q.full); };
        container.appendChild(btn);
    });
}

// التحقق من الإجابة
function checkGameAns(selected, correct, full) {
    var msg = document.getElementById("gMsg");
    var gNextBtn = document.getElementById("gNextBtn");
    var gWordElem = document.getElementById("gWord");

    if (selected === correct) {
        if (msg) {
            msg.style.color = "#38a169";
            msg.innerText = "أحس
