<?php require_once 'framework.php'; ?>
<?php get_header('Swedish Vocabulary | Sleepless Demo'); ?>
	<header class="six-col pad right-align desc-hd" id="launch-header">
		<h1>Swedish Vocabulary</h1>
		<p class="desc-shd">Various words and phrases in Swedish with their English counterparts.</p>
	</header>
	
	<ul class="sidebar" id="launch-sidebar">
		<li>
			<div class="origami">
				<div class="origami-header">
					<img class="origami-image" src="static/images/se.png" alt="" />
				</div>
				<div class="origami-footer">
					<p class="origami-caption">By <a href="author.php">Sleepless</a></p>
				</div>
			</div>
		</li>
		<li>
			<a href="cards.php">1274 cards</a>
		</li>
		<li>
			<p>Tags:</p>
			<ul class="tags">
				<li><a href="search.php">language</a>, </li>
				<li><a href="search.php">swedish</a>, </li>
				<li><a href="search.php">vocabulary</a></li>
			</ul>
		</li>
	</ul>
	
	<form method="post" action="question.php" class="options six-col right-align" id="launch-form">
		<span class="input-btn large-btn go-btn"><input type="submit" name="start-studying" value="Start Studying" /></span>
		
		<h2 class="subhead pad">Study Options</h2>
		
		<div class="three-col-cell right-align">
			<div class="box check-box attention-box">
				<label class="box-shd"><input type="checkbox" name="record" /> Record your progress?</label>
				<p class="box-bd">Sleepless can record your progress in this deck for next time. As a guest, your progress will not be available on other devices.</p>
			</div>
			<p class="pad option-text">You have 27 cards to study today.</p>
		</div>
		
		<div class="three-col-cell pad option-group">
			<label class="small-text-option"><input type="number" min="0" max="1274" name="card-count" value="20" /> cards to study</label>
			<label class="sub-option checkbox-option"><input type="checkbox" name="continue" /> Continue from where I left off</label>
			
			<label class="checkbox-option"><input type="checkbox" name="use-time" /> Set a time limit for this session</label>
			<label class="sub-option small-text-option"><input type="number" min="0" name="time-limit" value="10" /> minutes</label>
			
			<label class="checkbox-option"><input type="checkbox" name="randomize" /> Randomize order</label>
			
			<label class="checkbox-option"><input type="checkbox" name="use-reverse" /> Include reversed cards</label>
		</div>
	</form>
<?php get_footer(); ?>