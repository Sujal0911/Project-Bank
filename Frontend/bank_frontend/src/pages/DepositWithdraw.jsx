import { useCallback, useEffect, useState } from 'react'
import Header from '../components/Header'
import '../styles/DepositWithdraw.css'

const backendUrl = import.meta.env.VITE_BACKEND_URL

function DepositWithdraw() {
  const [activeTab, setActiveTab] = useState('deposit')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  // Keep user in React state so the balance updates immediately
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const credentials = localStorage.getItem('credentials')

  const balance = Number(user?.balance ?? 0)
  const transactionAmount = amount ? parseFloat(amount) : 0

  const finalBalance =
    activeTab === 'deposit'
      ? balance + transactionAmount
      : balance - transactionAmount

  /*
   * Fetch the latest user/balance from backend.
   *
   * This is the important fix for the stale balance problem.
   */
  const refreshUser = useCallback(async () => {
    if (!credentials) {
      setError('Authentication information is missing.')
      return null
    }

    try {
      const response = await fetch(`${backendUrl}/accounts/login`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Unable to refresh account information.')
      }

      const updatedUser = await response.json()

      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))

      return updatedUser
    } catch (err) {
      console.error('Failed to refresh user:', err)
      setError(err.message || 'Unable to refresh account information.')
      return null
    }
  }, [credentials])

  /*
   * Load the latest balance when the page opens.
   *
   * IMPORTANT:
   * This uses [] rather than [handleDeposit].
   * The old code caused the effect to run again whenever
   * handleDeposit was recreated.
   */
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const handleAmountChange = (e) => {
    const value = e.target.value

    // Allow empty value
    if (value === '') {
      setAmount('')
      setError('')
      return
    }

    // Only allow numbers with up to 2 decimal places
    if (!/^\d*\.?\d{0,2}$/.test(value)) {
      return
    }

    const numericValue = parseFloat(value)

    // Maximum transaction amount
    if (!Number.isNaN(numericValue) && numericValue > balance) {
      setError('Amount exceeds Balance')
      return
    }
     if (!Number.isNaN(numericValue) && numericValue >= 10000000) {
      setError('Amount exceeds Transactional Limit')
      return
    }

    setAmount(value)
    setError('')
  }

  const validateForm = () => {
    const numericAmount = parseFloat(amount)

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.')
      return false
    }

    // if (numericAmount > 50000) {
    //   setError('Amount exceeds transaction limit of $50,000.')
    //   return false
    // }

    if (activeTab === 'withdraw' && numericAmount > balance) {
      setError('Insufficient balance.')
      return false
    }

    return true
  }

  const resetForm = () => {
    setAmount('')
    setDescription('')
    setError('')
  }

  const handleTabChange = (tab) => {
    if (loading) return

    setActiveTab(tab)
    resetForm()
    setSubmitted(false)
    setShowConfirm(false)
  }

  const handleSubmitClick = () => {
    if (validateForm()) {
      setShowConfirm(true)
    }
  }

  const handleDeposit = async () => {
    setShowConfirm(false)
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${backendUrl}/accounts/deposit/${transactionAmount}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Deposit failed. Please try again.')
      }

      /*
       * Refresh balance AFTER successful transaction.
       */
      const updatedUser = await refreshUser()

      if (!updatedUser) {
        throw new Error(
          'Deposit was processed, but the latest balance could not be loaded.'
        )
      }

      resetForm()
      setSubmitted(true)

      // Automatically return to form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      console.error('Deposit error:', err)
      setError(err.message || 'Deposit failed. Please try again.')
      setSubmitted(false)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    /*
     * Validate again before sending the request.
     * This protects against the balance changing while
     * the confirmation modal was open.
     */
    if (!validateForm()) {
      setShowConfirm(false)
      return
    }

    setShowConfirm(false)
    setLoading(true)
    setError('')

    try {
      const response = await fetch(
        `${backendUrl}/accounts/withdraw/${transactionAmount}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Withdrawal failed. Please try again.')
      }

      /*
       * Refresh balance AFTER successful withdrawal.
       */
      const updatedUser = await refreshUser()

      if (!updatedUser) {
        throw new Error(
          'Withdrawal was processed, but the latest balance could not be loaded.'
        )
      }

      resetForm()
      setSubmitted(true)

           // Automatically return to form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 3000)
    } catch (err) {
      console.error('Withdrawal error:', err)
      setError(err.message || 'Withdrawal failed. Please try again.')
      setSubmitted(false)
    } finally {
      setLoading(false)
    }
  }

  /*
   * If user information isn't available yet,
   * show a loading state instead of crashing.
   */
  if (!user) {
    return (
      <div className="app-container">
        <Header />

        <div className="page-container transaction-container">
          <div className="loading-state">
            Loading account information...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Header />

      <div className="page-container transaction-container">

        {/* Tabs */}
        <div className="tab-section">
          <button
            type="button"
            className={`tab ${activeTab === 'deposit' ? 'active' : ''}`}
            onClick={() => handleTabChange('deposit')}
            disabled={loading}
          >
            Deposit
          </button>

          <button
            type="button"
            className={`tab ${activeTab === 'withdraw' ? 'active' : ''}`}
            onClick={() => handleTabChange('withdraw')}
            disabled={loading}
          >
            Withdraw
          </button>
        </div>

        {submitted ? (
          <div className="success-state">
            <div className="success-icon">✓</div>

            <h3 className="success-title">
              {activeTab === 'deposit'
                ? 'Deposit confirmed'
                : 'Withdrawal confirmed'}
            </h3>

            <p className="success-message">
              {activeTab === 'deposit'
                ? 'Your deposit has been processed successfully.'
                : 'Your withdrawal has been processed successfully.'}
            </p>

            <div className="success-details">
              <div className="detail-row">
                <span className="detail-label">Amount</span>

                <span className="detail-value">
                  {/* Amount was cleared after transaction,
                      so use the updated balance instead of
                      relying on the cleared input. */}
                  Transaction completed
                </span>
              </div>

              <div className="detail-row detail-total">
                <span className="detail-label">New balance</span>

                <span className="detail-value">
                  ${balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <form
            className="transaction-form"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmitClick()
            }}
          >

            {/* Current Balance */}
            <div className="balance-card">
              <div className="balance-label">
                Current balance
              </div>

              <div className="balance-amount">
                ${balance.toFixed(2)}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Amount */}
            <div className="form-group">
              <label htmlFor="amount">
                {activeTab === 'deposit'
                  ? 'Deposit amount'
                  : 'Withdrawal amount'}
              </label>

              <div className="amount-input-wrapper">
                <span className="currency-symbol">$</span>

                <input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">
                Description (optional)
              </label>

              <input
                id="description"
                type="text"
                placeholder={
                  activeTab === 'deposit'
                    ? 'e.g., Paycheck transfer'
                    : 'e.g., Cash withdrawal'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Transaction Review */}
            {transactionAmount > 0 &&
              !error &&
              (activeTab === 'deposit' ||
                transactionAmount <= balance) && (
                <div className="review-section">
                  <div className="review-label">
                    Transaction summary
                  </div>

                  <div className="review-details">
                    <div className="detail-row">
                      <span className="detail-label">
                        {activeTab === 'deposit'
                          ? 'Deposit'
                          : 'Withdrawal'}
                      </span>

                      <span className="detail-value">
                        ${transactionAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="detail-row detail-separator">
                      <span className="detail-label">
                        New balance
                      </span>

                      <span className="detail-value">
                        ${finalBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            {/* Confirmation Modal */}
            {showConfirm && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h4 className="modal-title">
                    Confirm transaction
                  </h4>

                  <div className="modal-details">
                    <p className="modal-text">
                      {activeTab === 'deposit'
                        ? `Deposit $${transactionAmount.toFixed(
                            2
                          )} to your account?`
                        : `Withdraw $${transactionAmount.toFixed(
                            2
                          )} from your account?`}
                    </p>
                  </div>

                  <div className="modal-buttons">
                    <button
                      type="button"
                      className="btn btn-secondary modal-btn"
                      onClick={() => setShowConfirm(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary modal-btn"
                      onClick={
                        activeTab === 'deposit'
                          ? handleDeposit
                          : handleWithdraw
                      }
                      disabled={loading}
                    >
                      {loading
                        ? 'Processing...'
                        : 'Confirm'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={
                !amount ||
                !!error ||
                loading
              }
            >
              {loading
                ? 'Processing...'
                : activeTab === 'deposit'
                ? 'Review Deposit'
                : 'Review Withdrawal'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default DepositWithdraw