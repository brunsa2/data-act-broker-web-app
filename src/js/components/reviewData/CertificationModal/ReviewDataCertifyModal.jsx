/**
  * ReviewDataCertifyModal.jsx
  * Created by Kevin Li 9/6/16
  **/

import React from 'react';
import Modal from 'react-aria-modal';
import * as Icons from '../../SharedComponents/icons/Icons.jsx';

import CertifyDisclaimer from './CertifyDisclaimer.jsx';
import CertifyButtons from './CertifyButtons.jsx';
import CertifyProgress from './CertifyProgress.jsx';

class VariableMessage extends React.Component {
	render() {
		let message = "1 warning";
		if (this.props.warnings != 1) {
			message = this.props.warnings + " warnings";
		}

		return (
			<h6>
				This submission contains <span className="variable-field">{message}</span>.
			</h6>
		)
	}
}

export default class ReviewDataCertifyModal extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			certified: false,
			showProgress: false,
			publishComplete: false,
			closeable: true
		};
	}

	clickedCertifyCheckbox(e) {
		this.setState({
			certified: !this.state.certified
		});
	}

	clickedCertifyButton(e) {
		e.preventDefault();

		// show the progress bar
		this.setState({
			showProgress: true,
			closeable: false
		}, () => {
			// mock the API completion
			window.setTimeout(() => {
				this.setState({
					publishComplete: true,
					closeable: true
				});
			}, 5 * 1000);
		});
	}

	closeModal(e) {
		if (e) {
			e.preventDefault();
		}

		if (!this.state.closeable) {
			return;
		}

		// reset the modal if closed
		this.setState({
			showProgress: false,
			certified: false,
			publishComplete: false
		}, () => {
			this.props.closeModal();
		});
	}

	render() {
		let message = null;
		if (this.props.warnings > 0) {
			message = <VariableMessage warnings={this.props.warnings} />;
		}

		let action = <CertifyButtons {...this.props}
						certified={this.state.certified}
						clickedCertifyButton={this.clickedCertifyButton.bind(this)}
						clickedCertifyCheckbox={this.clickedCertifyCheckbox.bind(this)} />;

		if (this.state.showProgress) {
			action = <CertifyProgress {...this.props.session} 
						finished={this.state.publishComplete} 
						closeModal={this.closeModal.bind(this)} />;
		}

		let hideClose = "";
		if (!this.state.closeable) {
			hideClose = " hide";
		}

		return (
			<Modal mounted={this.props.isOpen} onExit={this.closeModal.bind(this)} underlayClickExits={this.state.closeable}
				verticallyCenter={true} initialFocus="#certify-check" titleId="usa-da-certify-modal">
				<div className="usa-da-modal-page">
					<div id="usa-da-certify-modal" className="usa-da-certify-modal">
                        <div className={"usa-da-certify-modal-close usa-da-icon usa-da-icon-times" + hideClose}>
                            <a href="#" onClick={this.closeModal.bind(this)}> <Icons.Times /> </a>
                        </div>

                        <div className="usa-da-certify-modal-content">
                        	<div className="row">
	                            <div className="col-md-12 title-field">
	                                <h6>Are you sure you want to publish your data?</h6>
	                                {message}
	                            </div>
	                        </div>
	                        <div className="row">
	                        	<div className="col-md-12">
		                        	<CertifyDisclaimer />
		                        </div>
	                        </div>

							<div className="alert alert-warning">
								<span className="usa-da-icon"><Icons.ExclamationCircle /></span>
			                    <div className="alert-header-text">Simulated Publish</div>
			                    <p>Data is not submitted or published at this time.</p>
							</div>

	                        {action}

                        </div>
                    </div>
				</div>
			</Modal>
		)
	}
}