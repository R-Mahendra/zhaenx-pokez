class MyCustomElement extends HTMLElement {
	connectedCallback() {
		this.innerHTML = "~ Zhaenx PokeZ ~";
	}
}

customElements.define("zx-custom-element", MyCustomElement);


class MyCustomFooter extends HTMLElement {
	connectedCallback() {
		const d = new Date();
		this.innerHTML = `
		<div class="container-fluid zx-custom-footer">
	<div class="row">
		<div class="col-lg-12 text-center">Copyright&copy;${d.getFullYear()}.Allrights reserved
		<h6 class="mb-0">Created By R.Mahendra</h6></div>
	</div>
</div>
`;
	}
}

customElements.define("zx-custom-footer", MyCustomFooter);
