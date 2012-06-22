<?php require_once 'framework.php'; ?>
<?php get_header('UI Patterns Guide | Sleepless Demo', 'show-grid'); ?>
	<header class="spread">
		<h1>Sleepless UI Patterns Guide</h1>
		<div class="meta">
			<p class="meta-hd">Jump to: </p>
			<ul class="tags">
				<li><a href="#spreads">spreads</a>, </li>
				<li><a href="#grids">grids</a>, </li>
				<li><a href="#desc-hds">descriptive headings</a>, </li>
				<li><a href="#boxes">boxes</a>, </li>
				<li><a href="#card-lists">card lists</a>, </li>
				<li><a href="#buttons">buttons</a>, </li>
				<li><a href="#tags">tags</a>, </li>
				<li><a href="#meta">meta</a>, </li>
				<li><a href="#options">options</a>, </li>
				<li><a href="#combo-fields">combo fields</a>, </li>
				<li><a href="#logotypes">logotypes</a></li>
			</ul>
		</div>
	</header>
	
	<section id="spread">
		<header class="spread desc-hd">
			<h1>Spreads</h1>
			<p class="desc-shd">Spreads are used for laying out textual content against the grid. For laying out buttons, take a look at <a href="#grids">grids</a>. Unlike grids, padding is applied to each spread and any element can have a spread applied to it. Full spreads take up the entire width of the design without padding.</p>
		</header>
		
		<p class="spread full-spread blue">.spread.full-spread</p>
		<p class="spread blue">.spread</p>
		<p class="spread seven-col-spread blue">.spread.seven-col-spread</p>
		<p class="spread six-col-spread blue">.spread.six-col-spread</p>
		<p class="spread five-col-spread blue">.spread.five-col-spread</p>
		<p class="spread four-col-spread blue">.spread.four-col-spread</p>
		<p class="spread three-col-spread blue">.spread.three-col-spread</p>
		<p class="spread two-col-spread blue">.spread.two-col-spread</p>
		<p class="spread one-col-spread blue">.one-col</p>
		
		<p class="spread four-col-spread center-spread blue">.center-spread can be applied to center a spread</p>
		<p class="spread three-col-spread center-spread blue">.center-spread is useful for spreads centered amongst other spreads, and even amongst grids or mixes of both.</p>
	</section>
	
	<section id="grids">
		<header class="spread desc-hd">
			<h1>Grids</h1>
			<p class="desc-shd">Grids are like spreads, only they do not contain padding and can only be used on lists. Column sizes can be used to change the size of the individual columns. They are most useful for displaying boxes. Individual columns can be padded to allow for intermingled textual content.</p>
		</header>
		
		<ul class="grid">
			<li class="one-col-grid blue">.one-col</li>
			<li class="seven-col-grid blue">.seven-col-grid</li>
			
			<li class="two-col-grid blue">.two-col-grid</li>
			<li class="six-col-grid blue">.six-col-grid</li>
			
			<li class="three-col-grid blue">.three-col-grid</li>
			<li class="five-col-grid blue">.five-col-grid</li>
			
			<li class="four-col-grid blue">.four-col-grid</li>
			<li class="four-col-grid blue">.four-col-grid</li>
			
			<li class="box">
				This box is here as an alignment example
			</li>
			<li class="pad-grid blue">Using .pad-grid, this text is aligned to the box's.</li>
		</ul>
	</section>
	
	<header class="spread desc-hd" id="desc-hds">
		<h1>Descriptive Heading</h1>
		<h2 class="desc-shd">Children h1, h2, and h3 automatically become descriptive headings. Any child element with a .desc-shd class will become a descriptive subheading, like this! .desc-hd-spaced will apply generous whitespace between the heading and the subheading, and .pull-desc can be used to integrate the subheading into the form of the deck launch page.</h2>
	</header>
	<code class="spread">
&lt;header class=&quot;desc-hd&quot;&gt;
	&lt;h1&gt;Descriptive Heading&lt;/h1&gt;
	&lt;h2 class=&quot;desc-shd&quot;&gt;This is a descriptive subheading.&lt;/h2&gt;
&lt;/header&gt;
	</code>
	
	<section id="boxes">
		<header class="spread desc-hd">
			<h1>Boxes</h1>
			<p class="desc-shd">Boxes are useful for emphatically displaying different types of information. They are usually displayed within a grid (as they are here) and can be styled for different contexts.</p>
		</header>
		
		<ul class="grid">
			<li><div class="box">.box</div></li>
			<li><a href="#" class="box">a.box</a></li>
			<li><div class="box light-box">.light-box</div></li>
			<li><div class="box discovery-box">.discovery-box</div></li>
			<li><div class="box new-box">.new-box</div></li>
			<li><a href="#" class="box new-box">a.new-box</a></li>
			<li><div class="box attention-box">.attention-box</div></li>
			
			<li>
				<div class="box">
					<h2 class="box-hd">.box-hd</h2>
					<h3 class="box-shd">.box-shd</h3>
					<p class="box-bd">.box-bd</p>
				</div>
			</li>
			
			<li>
				<div class="box numeric-box">
					<h2 class="box-hd">Numeric Box</h2>
					<p class="box-bd">.box.numeric-box> .box-num</p>
					<span class="box-num">12345</span>
				</div>
			</li>
			
			<li>
				<div class="box check-box">
					<label class="box-shd"><input type="checkbox" /> .check-box example</label>
					<p class="box-bd">Check box body text.</p>
				</div>
			</li>
		</ul>
	</section>
	
	<section id="card-lists">
		<header class="spread desc-hd">
			<h1>Card Lists</h1>
			<p class="desc-shd">Card lists are useful for displaying each card in a deck. JavaScript is used to make them more adaptable to smaller screen sizes without restricting access to data.</p>
		</header>
		
		<table cellspacing="0" class="card-list">
			<thead>
				<tr>
					<th class="is-essential is-persistent"><span class="hide">Order</span></th>
					<th class="is-essential">Status</th>
					<th class="is-essential">Class</th>
					<th class="is-optional">Extra Field</th>
					<th>Extra Field 2</th>
				</tr>
			</thead>
			<tbody>
				<tr class="completed-card-list-row">
					<td>1</td>
					<td>Completed</td>
					<td>.completed-card-list-row</td>
					<td>Extra field</td>
					<td>Another extra field</td>
				</tr>
				<tr class="upcoming-card-list-row">
					<td>2</td>
					<td>Upcoming</td>
					<td>.upcoming-card-list-row</td>
					<td>Extra field</td>
					<td>Another extra field</td>
				</tr>
				<tr>
					<td>3</td>
					<td>None</td>
					<td>None</td>
					<td>Extra field</td>
					<td>Another extra field</td>
				</tr>
			</tbody>
		</table>
	</section>
	
	<section id="buttons">
		<header class="spread desc-hd">
			<h1>Buttons</h1>
			<p class="desc-shd">Buttons are used to allow users to take actions, whether that be searching or studying. They can be styled for different contexts.</p>
		</header>
		
		<div class="spread">
			<a href="#" class="btn">.btn</a>
			<br />
			<a href="#" class="btn back-btn">.btn.back-btn</a>
			<br />
			<a href="#" class="btn begin-btn">.btn.begin-btn</a>
			<br />
			<a href="#" class="btn begin-btn large-btn">.begin.large</a>
		</div>
	</section>
	
	<section id="tags">
		<header class="spread desc-hd">
			<h1>Tags</h1>
			<p class="desc-shd">Tags can be used to display words associated with a deck. This styling should be applied to a list element that contains multiple &lt;li&gt; with &lt;a&gt; children.</p>
		</header>
		
		<ul class="spread tags">
			<li><a href="#">tags</a>, </li>
			<li><a href="#">tags</a>, </li>
			<li><a href="#">tags</a></li>
		</ul>
	</section>
	
	<section id="meta">
		<header class="spread desc-hd">
			<h1>Meta</h1>
			<p class="desc-shd">Useful for displaying information, especially key-value data. This style can be applied to lists or any parent container. Tags can easily be included in a meta block.</p>
		</header>
		
		<ul class="spread meta">
			<li>
				<h2 class="meta-hd">.meta-hd:</h2>
				<a href="#" class="meta-link">.meta-link</a>
			</li>
			<li>
				<h2 class="meta-hd">.meta-hd:</h2>
				<p class="meta-bd">.meta-bd</p>
			</li>
			<li>
				<h2 class="meta-hd">.meta-hd:</h2>
				<ul class="tags">
					<li><a href="#">tags</a>, </li>
					<li><a href="#">tags</a>, </li>
					<li><a href="#">tags</a></li>
				</ul>
			</li>
		</ul>
	</section>
	
	<section id="options">
		<header class="spread desc-hd">
			<h1>Options</h1>
			<p class="desc-shd">Options are forms which allow the user to specify how something should work for them. It should only be applied to form elements.</p>
		</header>
		
		<form method="post" action="question.php" class="spread options">
			<label class="small-text-option"><input type="text" /> .leading-option-field results in a small, right-aligned text box</label>
			<label class="sub-option checkbox-option"><input type="checkbox" /> label.sub-option</label>
			
			<label class="checkbox-option"><input type="checkbox" /> Form control wrapped in a &lt;label&gt;</label>
			<label class="sub-option small-text-option"><input type="text" /> label.sub-option</label>
			
			<label class="checkbox-option"><input type="checkbox" /> Form control wrapped in a &lt;label&gt;</label>
			
			<p class="option-text">p.option-text</p>
			<p class="option-text">Note: .option-group can be applied to &lt;fieldset&gt; and other containers to prevent float collapsing.</p>
		</form>
	</section>
	
	<section id="combo-fields">
		<header class="spread desc-hd">
			<h1>Combo Fields</h1>
			<p class="desc-shd">Combo fields are for merged text/button fields. This is primarily used for the search form at the top of each page. A combo field will take up the entire width of its container. Because of its complex styling, it has very specific markup.</p>
		</header>
		
		<form method="get" action="#" class="spread full-spread combo-field">
			<input type="submit" value=".btn.combo-field-btn" class="btn combo-field-btn" />
			<span><input type="text" class="combo-field-text" value=".combo-field-text" /></span>
		</form>
	</section>
	
	<section id="logotypes">
		<header class="spread desc-hd">
			<h1>Logotypes</h1>
			<p class="desc-shd">The logotype can be applied anywhere, but is mainly used in the masthead at the top of each page.</p>
		</header>
		
		<a href="index.php" class="spread logotype">Sleepless.logotype</a>
	</section>
<?php get_footer(); ?>