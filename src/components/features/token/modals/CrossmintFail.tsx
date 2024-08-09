import React from "react";

const CrossmintFail = ({ setCrossmintTransactionFailed }) => {
  return (
    <div className="modal fade show flex backdrop-blur-sm backdrop-opacity-50 justify-center items-center">
      <div className="modal-dialog shadow-xl max-w-4xl z-50">
        <div className="modal-content !bg-secondaryBlack">
          <div className="modal-header">
            <h5 className="modal-title">Transaction Failed</h5>
            <button type="button" className="btn-close" onClick={setCrossmintTransactionFailed}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                className="fill-jacarta-700 h-6 w-6 dark:fill-white"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
              </svg>
            </button>
          </div>

          <div className="modal-body pl-6 pr-32 pb-6">
            <p className="text-white">The transaction has failed. Please try again.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossmintFail;
