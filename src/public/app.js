(function () {
  'use strict';

  // DOM Elements
  const rawNotesInput = document.getElementById('rawNotes');
  const cleanedNotesOutput = document.getElementById('cleanedNotes');
  const cleanBtn = document.getElementById('cleanBtn');
  const clearBtn = document.getElementById('clearBtn');
  const copyBtn = document.getElementById('copyBtn');
  const statsDiv = document.getElementById('stats');
  const errorDiv = document.getElementById('error');

  // State
  let currentCleanedText = '';

  /**
   * Show error message
   */
  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
  }

  /**
   * Hide error message
   */
  function hideError() {
    errorDiv.classList.add('hidden');
  }

  /**
   * Show stats
   */
  function showStats(stats) {
    statsDiv.innerHTML = `
      <strong>Stats:</strong>
      ${stats.itemCount} items extracted |
      ${stats.inputLength} chars in → ${stats.outputLength} chars out
    `;
    statsDiv.classList.remove('hidden');
  }

  /**
   * Hide stats
   */
  function hideStats() {
    statsDiv.classList.add('hidden');
  }

  /**
   * Convert markdown bold to HTML
   */
  function markdownToHtml(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .split('\n')
      .join('<br>');
  }

  /**
   * Clean notes via API
   */
  async function cleanNotes() {
    const rawNotes = rawNotesInput.value.trim();

    if (!rawNotes) {
      showError('Please enter some notes to clean.');
      return;
    }

    hideError();
    cleanBtn.disabled = true;
    cleanBtn.classList.add('loading');
    cleanBtn.textContent = 'Cleaning...';

    try {
      const response = await fetch('/api/notes/clean', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: rawNotes }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to clean notes');
      }

      currentCleanedText = result.data.formatted;

      if (currentCleanedText) {
        cleanedNotesOutput.innerHTML = markdownToHtml(currentCleanedText);
        copyBtn.disabled = false;
        showStats(result.data.stats);
      } else {
        cleanedNotesOutput.innerHTML = '<p class="placeholder">No meaningful content found in the notes.</p>';
        copyBtn.disabled = true;
        hideStats();
      }
    } catch (error) {
      showError(error.message || 'An error occurred. Please try again.');
      cleanedNotesOutput.innerHTML = '<p class="placeholder">Cleaned notes will appear here...</p>';
      copyBtn.disabled = true;
      hideStats();
    } finally {
      cleanBtn.disabled = false;
      cleanBtn.classList.remove('loading');
      cleanBtn.textContent = 'Clean Notes';
    }
  }

  /**
   * Clear all inputs and outputs
   */
  function clearAll() {
    rawNotesInput.value = '';
    cleanedNotesOutput.innerHTML = '<p class="placeholder">Cleaned notes will appear here...</p>';
    currentCleanedText = '';
    copyBtn.disabled = true;
    hideError();
    hideStats();
  }

  /**
   * Copy cleaned notes to clipboard
   */
  async function copyToClipboard() {
    if (!currentCleanedText) return;

    try {
      await navigator.clipboard.writeText(currentCleanedText);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (error) {
      showError('Failed to copy to clipboard');
    }
  }

  // Event Listeners
  cleanBtn.addEventListener('click', cleanNotes);
  clearBtn.addEventListener('click', clearAll);
  copyBtn.addEventListener('click', copyToClipboard);

  // Allow Ctrl+Enter to clean notes
  rawNotesInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      cleanNotes();
    }
  });
})();
