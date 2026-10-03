import React, { useEffect, useState } from "react";
import "./Contact Message.css";

function ContactMessage() {

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [replyText, setReplyText] =
    useState({});

  const [replying, setReplying] =
    useState(null);


  // ==================================================
  // LOAD CONTACT MESSAGES
  // ==================================================

  const loadMessages = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/contact-messages"
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to load contact messages."
        );

      }

      setMessages(
        data.messages || []
      );

    } catch (error) {

      console.error(
        "CONTACT MESSAGES ERROR:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to backend."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // SEND ADMIN REPLY
  // ==================================================

  const sendReply = async (messageId) => {

    const reply =
      replyText[messageId]?.trim();

    if (!reply) {

      alert("Please enter a reply.");

      return;

    }

    try {

      setReplying(messageId);

      const response = await fetch(
        `http://localhost:5000/api/admin/contact-messages/${messageId}/reply`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            admin_reply: reply
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to send reply."
        );

      }

      alert("Reply sent successfully!");

      setReplyText((previous) => ({
        ...previous,
        [messageId]: ""
      }));

      await loadMessages();

    } catch (error) {

      console.error(
        "ADMIN REPLY ERROR:",
        error
      );

      alert(
        error.message ||
        "Unable to send reply."
      );

    } finally {

      setReplying(null);

    }

  };


  // ==================================================
  // LOAD WHEN PAGE OPENS
  // ==================================================

  useEffect(() => {

    loadMessages();

  }, []);


  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div className="contact-message-page">


      {/* ==================================================
          HEADER
          ================================================== */}

      <div className="contact-message-header">

        <div>

          <h1>
            Contact Messages
          </h1>

          <p>
            Messages received from CEMTrack customers
          </p>

        </div>


        <button
          type="button"
          className="refresh-message-btn"
          onClick={loadMessages}
        >
          🔄 Refresh
        </button>

      </div>


      {/* ==================================================
          LOADING
          ================================================== */}

      {loading && (

        <div className="message-status">

          Loading messages...

        </div>

      )}


      {/* ==================================================
          ERROR
          ================================================== */}

      {!loading && error && (

        <div className="message-error">

          {error}

        </div>

      )}


      {/* ==================================================
          NO MESSAGES
          ================================================== */}

      {!loading &&
        !error &&
        messages.length === 0 && (

          <div className="message-empty">

            <div className="empty-icon">
              📩
            </div>

            <h2>
              No Messages Yet
            </h2>

            <p>
              Customer messages will appear here
              when someone contacts CEMTrack.
            </p>

          </div>

        )}


      {/* ==================================================
          MESSAGES TABLE
          ================================================== */}

      {!loading &&
        !error &&
        messages.length > 0 && (

          <div className="message-table-container">

            <table className="message-table">

              <thead>

                <tr>

                  <th>#</th>

                  <th>Customer</th>

                  <th>Email</th>

                  <th>Subject</th>

                  <th>Message</th>

                  <th>Date</th>

                  <th>Status</th>

                  <th>Action</th>

                </tr>

              </thead>


              <tbody>

                {messages.map(
                  (item, index) => (

                    <tr
                      key={
                        item.message_id
                      }
                    >

                      <td>
                        {index + 1}
                      </td>


                      <td>
                        {item.name}
                      </td>


                      <td>
                        {item.email}
                      </td>


                      <td>
                        {item.subject}
                      </td>


                      <td className="message-column">

                        {item.message}

                      </td>


                      <td className="date-column">

                        {item.created_at
                          ? new Date(
                              item.created_at
                            ).toLocaleString()
                          : "-"}

                      </td>


                      {/* STATUS */}

                      <td>

                        {item.admin_reply ? (

                          <span className="reply-status replied">
                            Replied
                          </span>

                        ) : (

                          <span className="reply-status pending">
                            Not Replied
                          </span>

                        )}

                      </td>


                      {/* ACTION */}

                      <td>

                        <button
                          type="button"
                          className="reply-btn"
                          onClick={() =>
                            setReplyText((previous) => ({
                              ...previous,
                              [item.message_id]:
                                previous[item.message_id] || ""
                            }))
                          }
                        >
                          {item.admin_reply
                            ? "Edit Reply"
                            : "Reply"}
                        </button>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>


            {/* ==================================================
                REPLY BOXES
                ================================================== */}

            {messages.map((item) => (

              <div
                key={`reply-${item.message_id}`}
                className="reply-section"
              >

                <div className="reply-section-header">

                  <div>

                    <h3>
                      Reply to {item.name}
                    </h3>

                    <p>
                      {item.subject}
                    </p>

                  </div>

                </div>


                {item.admin_reply && (

                  <div className="previous-reply">

                    <strong>
                      Previous Admin Reply:
                    </strong>

                    <p>
                      {item.admin_reply}
                    </p>

                    {item.replied_at && (

                      <small>
                        Replied on:{" "}
                        {new Date(
                          item.replied_at
                        ).toLocaleString()}
                      </small>

                    )}

                  </div>

                )}


                <textarea
                  className="reply-textarea"
                  rows="4"
                  placeholder="Write your reply to the customer..."
                  value={
                    replyText[item.message_id] || ""
                  }
                  onChange={(event) =>
                    setReplyText((previous) => ({
                      ...previous,
                      [item.message_id]:
                        event.target.value
                    }))
                  }
                />


                <button
                  type="button"
                  className="send-reply-btn"
                  onClick={() =>
                    sendReply(item.message_id)
                  }
                  disabled={
                    replying === item.message_id
                  }
                >

                  {replying === item.message_id
                    ? "Sending..."
                    : item.admin_reply
                    ? "Update Reply"
                    : "Send Reply"}

                </button>

              </div>

            ))}

          </div>

        )}

    </div>

  );

}

export default ContactMessage;