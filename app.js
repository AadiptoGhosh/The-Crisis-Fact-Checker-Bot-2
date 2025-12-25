/**
 * CrisisVerify - Frontend Logic
 * Simulates Vertex AI Search & Conversation interaction
 */
// Simulation Configuration
const SIMULATION_DELAY_MS = 1500; // Simulated AI latency
// DOM Elements
const feedContainer = document.getElementById('feed-container');
const reportForm = document.getElementById('reportForm');
// State
let trustedData = [];
// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    console.log('CrisisVerify App Initialized');
    
    // Load Truth Data
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        trustedData = data.trusted_reports;
        console.log('Loaded Trusted Data:', trustedData);
    } catch (error) {
        console.error('Failed to load data.json:', error);
    }
    // Initialize Feed if container exists
    if (feedContainer) {
        // Clear loading state
        feedContainer.innerHTML = '';
        
        // Add some sample initial posts
        renderPost({
            title: "Flooding in Sector 4",
            description: "Water levels represent a significant danger. Avoid area.",
            location: "Sector 4",
            timestamp: new Date().toISOString(),
            status: "verified",
            confidence: 0.98,
            source: "Official Sensor Network"
        });
    }
    // Attach Form Listener
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmission);
    }
});
/**
 * Handle Report Submission
 */
async function handleReportSubmission(e) {
    e.preventDefault();
    const type = document.getElementById('incidentType').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    if (!type || !location || !description) return;
    // Create a temporary "Pending" card
    const tempId = Date.now();
    const postData = {
        title: `${type} at ${location}`,
        description: description,
        location: location,
        timestamp: new Date().toISOString(),
        status: "pending",
        confidence: 0,
        source: "User Report",
        id: tempId
    };
    // Prepend to feed
    renderPost(postData, true); // true = prepend
    
    // Reset form
    reportForm.reset();
    // Simulate AI Verification
    const verificationResult = await simulateVertexAIVerification(description, location);
    
    // Update the card with results
    updatePostStatus(tempId, verificationResult);
}
/**
 * Simulate Vertex AI Verification
 * Logic: Checks description against trusted_reports in data.json using keyword matching
 */
async function simulateVertexAIVerification(text, location) {
    // Simulate Network Delay
    await new Promise(resolve => setTimeout(resolve, SIMULATION_DELAY_MS));
    const query = (text + " " + location).toLowerCase();
    
    // Simple Match Logic
    let bestMatch = null;
    let highestScore = 0;
    for (const report of trustedData) {
        const reportContent = (report.event + " " + report.location + " " + report.details).toLowerCase();
        
        // Count overlapping words (Naive Search)
        const queryWords = query.split(/\s+/);
        let matchCount = 0;
        queryWords.forEach(word => {
            if (word.length > 3 && reportContent.includes(word)) {
                matchCount++;
            }
        });
        // Calculate a score
        const score = matchCount / Math.max(queryWords.length, 1);
        
        if (score > highestScore) {
            highestScore = score;
            bestMatch = report;
        }
    }
    // Determine Result based on "Ground Truth"
    if (bestMatch && highestScore > 0.3) {
        // We found a matching official report
        if (bestMatch.status === 'scam') {
            return {
                status: 'scam',
                confidence: bestMatch.confidence, // High confidence it's a scam
                reason: `AI Analysis: Matches known misinformation pattern (Ref: ${bestMatch.id}).`
            };
        } else if (bestMatch.status === 'false') {
             return {
                status: 'scam', // Using "scam" badge/color for False reports too
                confidence: bestMatch.confidence,
                reason: `AI Verification: Official sources confirm this event is NOT occurring (Ref: ${bestMatch.id}).`
            };
        } else {
            return {
                status: 'verified',
                confidence: bestMatch.confidence,
                reason: `AI Verification: Corroborated by official data (Ref: ${bestMatch.id}).`
            };
        }
    } else {
        // No match found - Indeterminate
        return {
            status: 'pending', // Remain pending/analyzing
            confidence: 0.45, // Low confidence
            reason: "AI Analysis: Insufficient data to verify. Flagged for manual review."
        };
    }
}
/**
 * Render a Post Card
 */
function renderPost(data, prepend = false) {
    const card = document.createElement('article');
    card.className = 'card';
    card.id = `post-${data.id || Date.now()}`;
    
    // Determine Badge Class
    let badgeClass = 'badge-pending';
    let badgeText = 'Analyzing...';
    
    if (data.status === 'verified') {
        badgeClass = 'badge-verified';
        badgeText = 'Verified';
    } else if (data.status === 'scam') {
        badgeClass = 'badge-scam';
        badgeText = 'Potential Scam';
    }
    // Determine Meter Color
    let meterColor = 'var(--color-warning)';
    if (data.status === 'verified') meterColor = 'var(--color-success)';
    if (data.status === 'scam') meterColor = 'var(--color-danger)';
    const timeString = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    card.innerHTML = `
        <div class="card-header">
            <span class="badge ${badgeClass}" id="badge-${data.id}">${badgeText}</span>
            <small class="text-muted">${timeString}</small>
        </div>
        <div class="card-body">
            <h3>${data.title}</h3>
            <p>${data.description}</p>
            <div style="margin-top: 1rem;">
                <div class="trust-meter">
                    <span>Trust Score</span>
                    <div class="meter-track">
                        <div class="meter-fill" id="meter-${data.id}" style="width: ${data.confidence * 100}%; background-color: ${meterColor}"></div>
                    </div>
                    <span id="score-${data.id}">${Math.round(data.confidence * 100)}%</span>
                </div>
                <small class="text-muted" id="reason-${data.id}" style="display: block; margin-top: 0.5rem; font-style: italic;">
                    ${data.reason || "AI is analyzing reliability..."}
                </small>
            </div>
        </div>
        <div class="card-footer">
            ${data.location} • ${data.source}
        </div>
    `;
    if (prepend) {
        feedContainer.insertBefore(card, feedContainer.firstChild);
    } else {
        feedContainer.appendChild(card);
    }
}
/**
 * Update Post after Async Verification
 */
function updatePostStatus(id, result) {
    const badge = document.getElementById(`badge-${id}`);
    const meter = document.getElementById(`meter-${id}`);
    const score = document.getElementById(`score-${id}`);
    const reason = document.getElementById(`reason-${id}`);
    if (result.status === 'verified') {
        badge.className = 'badge badge-verified';
        badge.textContent = 'Verified';
        meter.style.backgroundColor = 'var(--color-success)';
    } else if (result.status === 'scam') {
        badge.className = 'badge badge-scam';
        badge.textContent = 'Potential Scam';
        meter.style.backgroundColor = 'var(--color-danger)';
    } else {
        badge.className = 'badge badge-pending';
        badge.textContent = 'Unverified';
        meter.style.backgroundColor = 'var(--color-warning)';
    }
    // Animate width
    setTimeout(() => {
        meter.style.width = `${result.confidence * 100}%`;
    }, 100);
    
    score.textContent = `${Math.round(result.confidence * 100)}%`;
    reason.textContent = result.reason;
}
